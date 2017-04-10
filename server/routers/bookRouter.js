const EPub    = require("../patched_modules/epub");
const express = require('express');
const fsx     = require('fs-extra');
const fsp     = require('fs-promise');
const path    = require('path');
const Promise = require('bluebird');
const URL = require('url');
const _ = require('lodash');
const request = require('request');
const router      = express.Router();
const superAgentRequest = require('superagent');

//path where all books can be found
const theBooksDir = path.join(__dirname, "..", "data", "books");
//ebook cache
var epubCache = {}


/**
 *  Parse epub file
 *  @param {String} dirPath
 *  @param {String} fileName
 *  @return {object} epub
 **/
function parseEpub(dirPath, fileName) {
    return new Promise(function(resolve, reject) {
        var epub = new EPub(path.join(dirPath, fileName), "/bookImage/" + fileName + "/", "/bookChapter/" + fileName + "/");
        epub.on("end", function(err) {
            if (err) {
                reject(err);
            } else {
                resolve(epub)
            }
        });
        epub.parse();
    })
}

/**
 *  Add book to chache
 *  @param {String} dirPath
 *  @param {String} fileName
 *  @return {object} epub
 **/
function readBook(dirPath, fileName) {
    return fsp.stat(path.join(dirPath, fileName))
        .then(function(stat) {
            //if ebook is already in the catch
            if (epubCache[fileName] && epubCache[fileName]._mtime.getTime() === stat.mtime.getTime()) {
                return epubCache[fileName];
            }
            //if ebook doens'n excists in the catch
            else {
                return parseEpub(dirPath, fileName)
                    .then(function(epub) {
                        //add filename to ebook object
                        epub._fileName = fileName;
                        //add timestamp to ebook object
                        epub._mtime = stat.mtime;
                        //add ebookobject to ebook cache
                        epubCache[fileName] = epub;
                        return epub;
                    })
            }
        });
}

/**
 *  Refresh ebook cache
 *  @param {String} dirPath
 **/
function refreshEpubCache(dirPath) {
    return fsp.readdir(dirPath)
        .then(function(fileNames) {
            // throw away all files/dir that aren't e-pubs
            fileNames = _.filter(fileNames, function(fileName) {
                return _(fileName.toLowerCase()).endsWith(".epub");
            });
            // create an array with promises for parsed books
            var fileInfos = _.map(fileNames, function(fileName) {
                return readBook(dirPath, fileName);
            });
            // after all books are read, convert the array into a map from fileName to epub
            return Promise.all(fileInfos)
                .then(function(allInfos) {
                    epubCache = _.indexBy(allInfos, function(epub) {
                        return path.basename(epub.filename);
                    });
                    return epubCache;
                })
                .catch(function(err) {
                    return err;
                })
        })
        .catch(function(err) {
            return err;
        })
};

//BOOK API 1: get an array from the parsed epub files
router.get("/", (req,res) => {
  const booksDirPath = path.join(theBooksDir, `${req.session.uniqueID}`);
  refreshEpubCache(booksDirPath)
      .then(function(listOfBooks) {
        res.send(listOfBooks);
      })
});

//BOOK API 2: get an array of the filenames of all the available ebooks
router.get("/filenames", (req,res) => {
  const booksDirPath = path.join(theBooksDir, `${req.session.uniqueID}`);
  fsp.readdir(booksDirPath)
    .then(function(fileNames){
      let fileNameArray = _.filter(fileNames,function(fileName) {
        return _(fileName.toLowerCase()).endsWith(".epub");
      });
      if(fileNameArray.length == 0){
        res.json({
          error: 1006,
          errormessage: "no books found"
        });
      }
      res.json(fileNameArray);
    }).catch(function(err){
      res.json({
        error: 1004,
        errormessage: "could not load books"
      });
    });
});

//BOOK API 3: get cover image from specific book
router.get("/:filename/cover", (req, res) => {
  const booksDirPath = path.join(theBooksDir, `${req.session.uniqueID}`);
  let bookName = req.params.filename;
  // Read the book with given filename
  readBook(booksDirPath, bookName)
    .then(function(book) {
      // Get the cover file named 'cover-image'
      book.getFile("cover-image", function(err, imageBuffer, mimeType) {
        if (imageBuffer) {
          res.type(mimeType);
            res.send(imageBuffer);
        } else {
          // If 'cover-image' wasn't found, search for 'cover'
          book.getFile("cover", function(err, imageBuffer, mimeType) {
            if (imageBuffer) {
              res.type(mimeType);
                res.send(imageBuffer);
            } else {
              res.json({
                error: 1005,
                errormessage: 'cover not found'
              }) // json
            } // else
          }) // getFile
        } // else
      }) // getFile
    }) // then
    .catch(function(err) {
      res.json({
        error: 1001,
        errormessage: 'book not found'
      })
    })
});

//BOOK API 4: get the toc from a book
router.get("/:filename/toc", (req, res) => {
    const booksDirPath = path.join(theBooksDir, `${req.session.uniqueID}`);
    let bookName = req.params.filename;
    readBook(booksDirPath, bookName)
        .then(function(epub) {
          let objKeys = Object.keys(epub.manifest);
          let idList = [];
          objKeys.map(function(key) {
            let objectItem = epub.manifest[key];
            if(objectItem['media-type'] == 'application/xhtml+xml'){
              idList.push(objectItem['id']);
            }
          })
          res.json(idList);
        }).catch(function(err) {
          res.json({
              error: 1001,
              errormessage: 'book not found'
          })
        });
});

//BOOK API 5: get a chapter from a book
router.get("/:filename/chapter/:chapterId", (req, res) => {
    const booksDirPath = path.join(theBooksDir, `${req.session.uniqueID}`);
    let bookName = req.params.filename;
    let chapterID = req.params.chapterId;
    //read the book
    readBook(booksDirPath, bookName)
        .then(function(epub) {
          // get asked chapter
            epub.getChapter(chapterID, function(err, text, mimeType) {
                //if asked chapter isn't found
                if (err || !text) {
                    res.json({
                        error: 1002,
                        errormessage: 'chapter not found'
                    })
                } else {
                    //replace default URL's width data-clickId width page id
                    text = text.replace(/ href="([^"]*)"/g, function(s, url) {
                        let urlObject = URL.parse(url);
                        if(urlObject.host != null){
                          return ` href="${urlObject.href}" target="_blank"`;
                        } else{
                          let file = urlObject.path;
                          try{
                            file = file.split('/');
                            file = file[(file.length - 1)];
                          }catch(err){
                            return '';
                          }
                          let ID = null;
                          epub.toc.map(function(object) {
                              if (object.href.includes(file)) {
                                  ID = object.id;
                              }
                          });
                          if (ID !== null) {
                              return ` data-clickId="${ID}"`;
                          } else {
                              return '';
                          }
                        }
                    });
                    //replace default image URL's width API image URL's
                    text = text.replace(/ src="([^"]*)"/g, function(s, url) {
                        let urlObject = URL.parse(url);
                        let file = urlObject.path.split('/');
                        file = file[(file.length - 1)];
                        // get an array of all used keys
                        let objKeys = Object.keys(epub.manifest);
                        let objArray = [];
                        Object.keys(epub.manifest).map(function(key) {
                            objArray.push(epub.manifest[key]);
                        });
                        let ID = null;
                        //check each element
                        objArray.map(function(key) {
                            let href = key.href.split('/');
                            href = href[(href.length - 1)];
                            if (href === file) {
                                ID = key.id;
                            }
                        });
                        // remove all spaces
                        bookName = bookName.replace(/ /g, "%20");
                        if (ID !== null) {
                            return ` src="http://localhost:3000/book/${bookName}/image/${ID}"`;
                        } else {
                            return '';
                        }
                    })
                    //send chapter as json object
                    res.json(text);
                }
            })
        }).catch(function(err) {
            res.json({
              error: 1001,
              errormessage: 'book not found'
            })
        });
});

//BOOK API 6: get image from book
router.get("/:fileName/image/:imageId", (req, res) => {
    const booksDirPath = path.join(theBooksDir, `${req.session.uniqueID}`);
    let bookName = req.params.fileName;
    let imageID = req.params.imageId;
    readBook(booksDirPath, bookName)
        .then(function(epub) {
            epub.getImage(imageID, function(err, image, mimeType) {
                if (err) {
                    res.json({
                        error: 1003,
                        errormessage: 'image not found'
                    })
                }
                res.type(mimeType);
                res.send(image);
            });
        }).catch(function(err) {
            res.json({
                error: 1001,
                errormessage: 'book not found'
            })
        });
});

router.get('/dropbox', (req,res) => {
  if(req.session.uniqueID && req.session.accessKey){
    const accesToken = `Bearer ${req.session.accessKey}`;
    const serverPath = `./data/books/${req.session.uniqueID}/`;
    const booksInCache = [];
    superAgentRequest
      .post('https://api.dropboxapi.com/2/files/list_folder')
      .type('application/json')
      .set('Authorization' ,accesToken)
      .send('{"path": ""}')
      .end(function(error, files) {
        const createOrEmpty = () => {
          if(!fsp.existsSync(serverPath)){
            return fsp.mkdirs(serverPath)
          }else{
            return new Promise(function(resolve,reject){
              let counter = 0;
              fsp.readdir(serverPath, (err, files) => {
                files.map(file => {
                  booksInCache.push(file);
                  counter ++;
                  if(counter == files.length){
                    resolve()
                  }
                });
                if(booksInCache.length == 0){
                  resolve()
                }
              })
            })
          }
        }
        createOrEmpty().then(function(){
          let nrOfBooks = 0;
          const loadBooks = () => {
            return new Promise(function(resolve, reject) {
              let nrOfBooks = 0;
              let nrOfBooksToLoad = 0;
              console.log(typeof files.body.entries);
              if(files.body.entries){
                files.body.entries.map(function(file,key){
                  if(file['path_lower'].endsWith(".epub") && booksInCache.indexOf(file['name']) == -1){
                    nrOfBooksToLoad ++;
                  }
                })
                files.body.entries.map(function(file,key){
                  if(file['path_lower'].endsWith(".epub") && booksInCache.indexOf(file['name']) == -1){
                    const stream = fsp.createWriteStream(serverPath + file['name']);
                    request('https://api-content.dropbox.com/2/files/download',{
                      headers : {
                        'Authorization' : accesToken,
                        'Dropbox-API-Arg' : '{\"path\": \"' + file['path_lower'] + '\"}'
                      }
                    }).pipe(stream);
                    stream.on('finish', function(){
                      nrOfBooks ++;
                      if(nrOfBooks == nrOfBooksToLoad){
                        resolve();
                      }
                    });
                  }
                })
                if(nrOfBooks == nrOfBooksToLoad){
                  resolve();
                }
              }else{
                resolve();
              }
            });
        }
        loadBooks().then(function(){
          res.send('done')
        });
      })
    })
  }else{
    res.send('error')
  }
});

module.exports = router;
