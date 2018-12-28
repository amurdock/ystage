import * as run from './run'

const exports = ['command', 'describe', 'builder']

describe('run', () => {
  it('describes the run command', () => {
    expect(run.command).toEqual('run <script>')
    expect(run.describe).toEqual('Run a yarn script in each package that contains that script')
    expect(typeof run.builder).toEqual('function')
    expect(typeof run.handler).toEqual('function')
  })
})
