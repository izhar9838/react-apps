const mainContainer = document.querySelector('#root');
const reactElement = {
    type:'a',
    props:{
        href:'https://www.google.com',
        target:'_blank'
    },
    children:'Click here to go to google'
}
function renderElement(reactElement,container){
    const actualDomElement = document.createElement(reactElement.type);
    actualDomElement.innerHTML=reactElement.children;
    for (let prop in reactElement.props) {
        actualDomElement.setAttribute(prop,reactElement.props[prop]);
    }
    container.appendChild(actualDomElement);
}
renderElement(reactElement,mainContainer);