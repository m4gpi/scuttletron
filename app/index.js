module.exports = function (root, server) {
  server.whoami((err, msg) => {
    if (err) {
      console.error(err)
    }
    else {
      console.log(root)
      root.innerHTML = msg.id
    }
  })
}
