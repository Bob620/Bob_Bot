const chalk = require('chalk');

/**
 * Simple logging class to provide easy creation of domain logging
 */
class Log {
  constructor() {
    this.bar = chalk.bold('|');
    this.domains = {general: chalk.blue, error: chalk.red.bold};
    this.color = (function* () {
      while (true) {
        yield chalk.green;
        yield chalk.yellow;
        yield chalk.magenta;
        yield chalk.cyan;
      }
    })();
  }

  /**
   * Logs the given text and adds the date and time
   * @param {string|chalk} text The text to be printed
   */
  print(text) {
    const dateObject = new Date().toISOString().split('T');
    const date = dateObject[0];
    const time = dateObject[1].slice(0, -5);

    console.log(`${chalk.grey(date)}${this.bar}${chalk.grey(time)}${this.bar}${text}`);
  }

  /**
   * Logs the given message and trace logs the error
   * @param {Error} err The error to trace
   * @param {string} message The message to log with the error, optional
   */
  error(err, message='An error occured.') {
    this.log('error', message);
    console.trace(err);
  }

  /**
   * Logs the given information
   * @param {string} domain The domain that the information is coming from
   * @param {string} message The message to print with the log
   */
  log(domain, message) {
    let domainColor = this.domains[domain.toLowerCase()];
    if (domainColor === undefined) {
        domainColor = this.domains['general'];
    }
    this.print(`${domainColor(domain.toUpperCase())}${this.bar}${message}`);
  }

  addDomain(name) {
    this.domains[name.toLowerCase()] = this.color.next().value;
  }
}

module.exports = new Log();
