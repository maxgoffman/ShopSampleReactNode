import React from 'react';

/** 
  * @desc Wrapping Element Component:
  * A little trick to mix the Card Deck with columns.
  * @author Maximiliano Goffman maxgoffman@gmail.com
  * @required bootstrap 4
*/
function WrappingElement({index, totalElements}) {
    if (index === totalElements) {
        return (<React.Fragment></React.Fragment>);
    }
    const children = [];
    let acum = 0;
    if ((index % 2) === 0) {
        children.push(
        <div key={(index*index) + (acum++)} className="w-100 d-none d-sm-block d-md-none">{/*<!-- wrap every 2 on sm-->*/}</div>
        );
        children.push(
        <div key={(index*index) + (acum++)} className="w-100 d-none d-md-block d-lg-none">{/*<!-- wrap every 2 on md-->*/}</div>            
        );
    }
    if ((index % 3) === 0) {
        children.push(
        <div key={(index*index) + (acum++)} className="w-100 d-none d-lg-block d-xl-none">{/*<!-- wrap every 3 on lg-->*/}</div>
        );
    }
    if ((index % 4) === 0) {
        children.push(
        <div key={(index*index) + (acum++)} className="w-100 d-none d-xl-block">{/*<!-- wrap every 4 on xl-->*/}</div>                    
        );
    }
    return(<React.Fragment>{children}</React.Fragment>);
}

export default WrappingElement;