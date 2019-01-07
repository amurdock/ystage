import execa from 'execa'

export const exec = async (command, args, options = null) =>
  execa(command, args, options)

export const spawn = (command, args, options = null) =>
  new Promise((resolve, reject) => {
    const child = execa(command, args, options)

    child.stdout.pipe(process.stdout)
    child.stderr.pipe(process.stderr)

    const onExit = (code, signal) => {
      const callback = code === 0 ? resolve : reject
      callback({ code, signal })
    }

    const onError = err => {
      child.removeListener('exit', onExit)
      reject({ err })
    }

    child.once('exit', onExit)
    child.once('error', onError)

    child.catch(err => reject({ err }))

    return child
  })
