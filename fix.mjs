import { readFileSync, writeFileSync } from 'fs';
let c = readFileSync('src/App.jsx', 'utf8');
c = c.replace('width:"100%", maxWidth:430, margin:"0 auto"', 'width:"100%", margin:"0 auto"');
c = c.replace('width:"100%",maxWidth:430,background:C.navBg,left:0,right:0,transform:"none"', 'width:"100%",background:C.navBg,left:0,right:0,transform:"none"');
writeFileSync('src/App.jsx', c);
console.log('done!');
