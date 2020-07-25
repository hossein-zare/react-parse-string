import React from 'react';
import ReactDOMServer from 'react-dom/server';

class ParseString extends React.Component {
    constructor(props) {
        super(props);
    }

    is(data, type) {
        return typeof data === type;
    }

    trim(data) {
        return this.is(data, 'object') ? data.filter(item => item !== '') : [data];
    }

    parse(data) {
        data = [data.trim()];
        const result = this.newLine(data);
        return this.direction(result);
    }

    newLine(data) {
        data = data.map(item => {
            if (this.is(item, 'string') && item.includes('\n')) {
                item = item.split('\n').map((item, key) => {
                    return <React.Fragment key={key}>{item}</React.Fragment>
                }).flat();
            }

            return item;
        });

        return data;
    }

    rules(data) {
        // Separation
        this.props.rules.forEach(item => {
            if (this.is(data, 'object')) {
                data = data.map(element => {
                    return element.split(item.regex)
                }).flat();
            } else {
                data = data.split(item.regex)
            }
        })
        
        // Replacement
        data = this.trim(data).map((item, index) => {
            this.props.rules.forEach(({regex, render}) => {
                if (this.is(item, 'string') && item.match(regex) !== null) {
                    item = render(item, index);
                    return;
                }
            });

            return item;
        });

        return data;
    }

    direction(data) {
        return data.map(item => {
            if (typeof item === 'string') {
                return [item].map((item, index) => {
                    const isRtl = this.isRtl(item);
                    return item !== '' ? (
                        <div key={index} style={{
                            direction: isRtl ? 'rtl' : 'ltr',
                            textAlign: isRtl ? 'right' : 'left',
                        }}>{this.rules(item)}</div>
                    ) : <br key={index} />;
                });
            } else {
                return item.map((item, index) => {
                    const markup = ReactDOMServer.renderToStaticMarkup(item);
                    const isRtl = this.isRtl(markup);
                    return markup !== '' ? (
                        <div key={index} style={{
                            direction: isRtl ? 'rtl' : 'ltr',
                            textAlign: isRtl ? 'right' : 'left',
                        }}>{this.rules(markup)}</div>
                    ) : <br key={index} />;
                });
            }
        });
    }

    isRtl(data) {
        const weakChars = '\u0000-\u0040\u005B-\u0060\u007B-\u00BF\u00D7\u00F7\u02B9-\u02FF\u2000-\u2BFF\u2010-\u2029\u202C\u202F-\u2BFF';
        const rtlChars = '\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC';
        const regex = new RegExp('^[' + weakChars + ']*[' + rtlChars + ']');
        
        return regex.test(data);
    }

    render() {
        return this.parse(
            this.props.children
        );
    }
}

ParseString.defaultProps = {
    rules: [],
}

export default ParseString;