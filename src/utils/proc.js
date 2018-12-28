import exaca from 'execa'

export const exec = async (command, args, options = null) =>
  exaca(command, args, options)
