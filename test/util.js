const console_el = document.getElementById('console')

export function log(x) {
  console_el.innerHTML += JSON.stringify(x) + '\n' 
}