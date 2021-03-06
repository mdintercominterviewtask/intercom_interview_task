# How To Run

1. You need to have nodejs installed: https://nodejs.org/en/
2. Install dependencies by running: `npm install`
3. Build: `npm run build`
4. Run tests: `npm test`
5. Run program to see the list of invited customers: `npm start -- -f customers.txt -d 100`

## Options

You can see the list of available options by running: `npm start -- -h`

```
Options:
  -f, --file <path>        File with the customer records
  -d, --distance <number>  Maximum distance wihthin which customers will be included (default: 100km)
  -h, --help               display help for command
```

## Deployment

Tests are run on every push as a github action. Check out _.github/workflows_ for config.

# Result

The list of invited customers can be found in the following file: _output.txt_
