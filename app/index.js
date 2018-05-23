module.exports = function (root, server) {
  server.whoami((err, msg) => {
    if (err) return console.error(err)
    console.log(root)
    root.innerHTML = msg.id
  })
}
