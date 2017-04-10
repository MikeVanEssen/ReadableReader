const webdriverio   = require('webdriverio');
const expect        = require('chai').expect;

const siteURL       = 'http://localhost:8080';

describe("Test the settings menu of the Readable Reader",function(){
  this.timeout(10000);    // prevent mocha from terminating a test to soon,
                          // when browser is slow

  var allBrowsers, chromeBrowser;

  before(function(done){
    allBrowsers = webdriverio.multiremote({
      chrome: {desiredCapabilities: {browserName: 'chrome'}}
    });
    allBrowsers.init().url(siteURL).then(function(){done();});
    chromeBrowser = allBrowsers.select("chrome");
  });

  it("should find a field to fill in a username and a button to submit the given username", function(done){
    chromeBrowser
      .elements("#usernameField").then(function(elements){
        expect(elements.value).to.have.length(1);
      })
      .elements("#submitUsername").then(function(elements){
        expect(elements.value).to.have.length(1);
        done();
      })
  });

  it("should submit a correct username", function(done){
    chromeBrowser
      .setValue("#usernameField","test").then(function(value){
        return chromeBrowser
                .click("#submitUsername")
                .waitForExist("#passwordField")
                .elements("#numberPad").then(function(elements){
                  expect(elements.value).to.have.length(1);
                  done();
                })
      })
  });

  it("should submit a correct password", function(done){
    chromeBrowser
      .click("#keypad0")
      .click("#keypad0")
      .click("#keypad0")
      .click("#keypad0")
      .click("#submitPasswordButton")
      .waitForExist("#booklist").then(function(){
        chromeBrowser.waitForExist("#toggleMenuButton").then(function(){
          done();
        })
      })
  });

  it("should open the settings menu", function(done){
    chromeBrowser
      .click("#toggleMenuButton")
      .waitForExist("#menuSection").then(function(){
        done();
      })
  });

  it("should find 'Uitloggen' button", function(done){
    chromeBrowser.elements("#logOutButton").then(function(element){
      expect(element.value).to.have.length(1);
      done();
    })
  });

  it("should find 'Letter grootte' button", function(done){
    chromeBrowser.elements("#fontSizeButton").then(function(element){
      expect(element.value).to.have.length(1);
      done();
    })
  })

  it("should find 'Lettertype' button", function(done){
    chromeBrowser.elements("#fontTypeButton").then(function(element){
      expect(element.value).to.have.length(1);
      done();
    })
  })

  it("should find 'Thema' button", function(done){
    chromeBrowser.elements("#themButton").then(function(element){
      expect(element.value).to.have.length(1);
      done();
    })
  })

  it("should NOT find 'Boekenplank' button", function(done){
    chromeBrowser.elements("#booklistButton").then(function(element){
      expect(element.value).to.have.length(0);
      done();
    })
  })

  it("should NOT find 'Volgende pagina' button", function(done){
    chromeBrowser.elements("#nextPageButton").then(function(element){
      expect(element.value).to.have.length(0);
      done();
    })
  })

  it("should NOT find 'Vorige pagina' button", function(done){
    chromeBrowser.elements("#previousPageButton").then(function(element){
      expect(element.value).to.have.length(0);
      done();
    })
  })

  it("should open the fontsize settings menu", function(done){
    chromeBrowser
      .click("#fontSizeButton")
      .waitForExist("#fontSizeMenuBackButton")
      .elements(".menuBlockItem")
      .then(function(elements){
        expect(elements.value).to.have.length(4);
        done();
      })
  });

  it("should have a default fontsize of 18",function(done){
    chromeBrowser
      .getText('#currentFontSize')
      .then(function(text) {
          expect(text).to.equal('18');
          done()
      });
  });

  it("should increase the fontsize with 1",function(done){
    chromeBrowser
      .click('#fontSizePlusButton')
      .getText('#currentFontSize')
      .then(function(text) {
          expect(text).to.equal('19');
          done()
      });
  });

  it("should decrease the fontsize with 1",function(done){
    chromeBrowser
      .click('#fontSizeMinButton')
      .getText('#currentFontSize')
      .then(function(text) {
          expect(text).to.equal('18');
          done()
      });
  });

  it("should return to the main settings menu",function(done){
    chromeBrowser
      .click('#fontSizeMenuBackButton')
      .waitForExist("#menuSection")
      .then(function(){
        done();
      });
  });

  it("should open the fonttype menu",function(done){
    chromeBrowser
      .click("#fontTypeButton")
      .waitForExist("#fontTypeMenuBackButton")
      .elements(".menuBlockItem")
      .then(function(elements){
        expect(elements.value).to.have.length(7);
        done();
      });
  });

  it("should select a fonttype",function(done){
    chromeBrowser
      .click("#monospaceButton")
      .element('#booklist-title')
      .getCssProperty('font-family')
      .then(function(font) {
        expect(font.value).to.equal('monospace');
        done()
      });
  });

  it("should return to the main settings menu",function(done){
    chromeBrowser
      .click('#fontTypeMenuBackButton')
      .waitForExist("#menuSection")
      .then(function(){
        done();
      });
  });

  it("should open the theme menu",function(done){
    chromeBrowser
      .click("#themButton")
      .waitForExist("#themeMenuBackButton")
      .elements(".menuBlockItem")
      .then(function(elements){
        expect(elements.value).to.have.length(5);
        done();
      })
  });

  it("should select a theme",function(done){
    chromeBrowser
      .click("#setCssButton_ThemeColorYellowBlack")
      .element('#booklist-title')
      .getCssProperty('color')
      .then(function(color) {
        expect(color.value).to.equal('rgba(253,255,0,1)');
        done()
      });
  });

  it("should return to the main settings menu",function(done){
    chromeBrowser
      .click('#themeMenuBackButton')
      .waitForExist("#menuSection")
      .then(function(){
        done();
      });
  });

  it("should close the settings menu", function(done){
    chromeBrowser
      .click("#toggleMenuButton")
      .elements("#menuSection")
      .then(function(elements){
        expect(elements.value).to.have.length(0);
        done();
      })
  });

  it("should open a book",function(done){
    chromeBrowser
    .waitForExist("#Wings")
    .click("#Wings")
    .waitForExist("#book-content")
    .then(function(){
      done()
    })
  });

  it("should display the next page button",function(done){
    chromeBrowser
    .waitForExist("#nextButton")
    .then(function(){
      done()
    })
  });

  it("should display the previous page button",function(done){
    chromeBrowser
    .waitForExist("#previousButton")
    .then(function(){
      done()
    })
  });

  it("should be able to show an popup image",function(done){
    chromeBrowser
    .element('img').click()
    .then(function(){
      done()
    })
  });

  it("should be able to hide an popup image",function(done){
    chromeBrowser
    .element('img').click()
    .then(function(){
      done()
    })
  });

    //TODO MIGUEL HIER

  it("should NOT open the previous page starting from the first page of the book",function(done){
    chromeBrowser
    .getText("#chapterText")
    .then(function(text){
      let textBefore = text;
      chromeBrowser
      .click("#previousButton")
      .getText("#chapterText")
      .then(function(newText) {
        expect(newText).to.equal(textBefore);
        done()
      })
    })
  });

  it("should open the next page",function(done){
    chromeBrowser
    .getText("#chapterText")
    .then(function(text){
      let textBefore = text;
      chromeBrowser
      .click("#nextButton")
      .getText("#chapterText")
      .then(function(newText) {
        expect(newText).to.not.equal(textBefore);
        done()
      })
    })
  });

  it("klik 1: should be able to open an internal link",function(done){
    chromeBrowser
    .click("#nextButton")
    .waitForExist("#nextButton")
    .click("#nextButton")
    .waitForExist("#nextButton")
    .click("#nextButton")
    .waitForExist("#nextButton")
    .click("#nextButton")
    .waitForExist("#nextButton")
    .click(".internalLink22")
    .getText(".internalLink0").then(function(text){
      expect(text).to.equal("ABOUT THE PUBLISHER")
      done();
    })
  });

  it("should NOT open the next page starting from the last page of the book",function(done){
    chromeBrowser
    .waitForExist("#nextButton")
    .click("#nextButton")
    .click("#nextButton")
    .click("#nextButton")
    .getText("#chapterText")
    .then(function(text){
      let textBefore = text;
      chromeBrowser
      .click("#nextButton")
      //.alertDismiss()
      .getText("#chapterText")
      .then(function(newText) {
        expect(newText).to.equal(textBefore);
        done()
      })
    })
  });

  it("should be able to log out the user",function(done){
    chromeBrowser
      .click("#toggleMenuButton")
      .waitForExist("#menuSection")
      .click("#logOutButton")
      .waitForExist("#usernameField")
      .then(function(){
        done();
      })
  });

  it("should find a button to register a user",function(done){
    chromeBrowser
      .waitForExist("#goToRegister")
      .elements("#goToRegister").then(function(elements){
        expect(elements.value).to.have.length(1);
        done();
      })
  });

  it("should click on the button 'Registreer' and enter a new username", function(done){
    let randomNumber = Math.floor((Math.random() * 1000) + 1);
    let newUserName = "testUser" + randomNumber;
    chromeBrowser
      .click("#goToRegister")
      .waitForExist("#usernameField")
      .setValue("#usernameField",newUserName).then(function(value){
        return chromeBrowser
          .click("#submitUsername")
          .waitForExist("#passwordField")
          .elements("#numberPad").then(function(elements){
            expect(elements.value).to.have.length(1);
            done();
          })
        })
    });

    it("should submit a new password", function(done){
      chromeBrowser
        .click("#keypad0")
        .click("#keypad0")
        .click("#keypad0")
        .click("#keypad0")
        .click("#submitPasswordButton")
        .then(function(){
          chromeBrowser
          .waitForExist("#booklist-title")
          done();
        });
    });
});
