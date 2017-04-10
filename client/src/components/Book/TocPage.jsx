import React from 'react';
import * as ReactRedux from 'react-redux';

import {getToc} from '../../reducers'


export class TocUI extends React.Component {
    render() {
        return (
            <div>
                {this.props.bookChapters[this.props.currentChapter]}
            </div>

        )
    }
}

function mapStateToProps(state){
    return{
        bookChapters:       state.settings.bookChapters,
        currentChapter:     state.settings.currentChapter
    }
}

function mapDispatchToProps(dispatch){
    return {
        getToc: (bookName) => dispatch(getToc(bookName))
    }
}

export const Toc = ReactRedux.connect(mapStateToProps,mapDispatchToProps)(TocUI);
