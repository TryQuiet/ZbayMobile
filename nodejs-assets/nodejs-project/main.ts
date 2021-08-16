import { Command } from 'commander'

export const start = () => {
    const program = new Command()
    program.requiredOption('-t --test <test>', 'test')
    program.parse(process.argv)

    const options = program.opts()

    console.log(`zbay: ${options.test}`)
}

start()
