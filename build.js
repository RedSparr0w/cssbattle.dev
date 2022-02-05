const fs = require('fs');
const path = require('path');
require.extensions['.html'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

// Get the text from our solutions
var solutionsPath = path.join(__dirname, "docs/solutions");
let output = [];
require("fs").readdirSync(solutionsPath).forEach(file => {
  output.push([`./solutions/${file}`, require(`./docs/solutions/${file}`)]);
});

output = output.sort(([a], [b]) => a.match(/(\d+)/)[1] - b.match(/(\d+)/)[1]).map(([file, text]) => {
  const id = file.match(/(\d+)/)[1];
  return `
  <div class="col">
    <div class="card shadow-sm">
      <a href="#" data-bs-toggle="modal" data-bs-target="#solutionModal" data-id="${id}">
        <img class="show-hover bd-placeholder-img card-img-top" width="100%" src="https://cssbattle.dev/targets/${id}.png"/>
      </a>
      <div class="card-body">
        <pre>
        <code>
${text.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </code>
        </pre>
        <p class="muted my-0">Solution #${id}</p>
      </div>
    </div>
  </div>`;
})

const data = require('./docs/_index.html').replace(/@replace@/, output.join(''));

fs.writeFile('./docs/index.html', data, (err) => {
  if (err)
    console.log(err);
  else {
    console.log("File written successfully!");
  }
});

/*
COPYING FILES/FOLDERS
*/

const copyRecursiveSync = function(src, dest) {
  var exists = fs.existsSync(src);
  var stats = exists && fs.statSync(src);
  var isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
};

/* To download all completed pages

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
Object.entries(localStorage).filter(([k,v]) => k.includes('lastCode') && !v.includes('https://cssbattle.dev/faqs')).slice(0,3).map(([k,v])=>[k.match(/(\d+)/)[1],v]).forEach(([k,v], i)=>setTimeout(() => download(`${k}.html`, v), i * 1000))

*/