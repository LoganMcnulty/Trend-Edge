import React from 'react';

const aTag = (url, text, styles) => {
    return (
            " " + `<a
            href=${url}
            target='_blank'
            style=${styles.link}
            >` + text + `</a>`

     );
}
 
export default aTag;