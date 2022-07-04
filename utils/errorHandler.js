module.exports = (client) => {
    process.on('beforeExit', (code) => { // If You Want You Can Use
        console.log('☆・[AntiCrash] | [BeforeExit_Logs] | [Start]・☆'.yellow.dim);
        console.log(code);
        console.log('☆・[AntiCrash] | [BeforeExit_Logs] | [End]・☆'.yellow.dim);
      });
      process.on('exit', (error) => { // If You Want You Can Use
        console.log('☆・[AntiCrash] | [Exit_Logs] | [Start] ☆'.yellow.dim);
        console.log(error);
        console.log('☆・[AntiCrash] | [Exit_Logs] | [End]・☆'.yellow.dim);
      });
      process.on('multipleResolves', (type, promise, reason) => { // Needed
        console.log('☆・[AntiCrash] | [MultipleResolves_Logs] | [start]・☆'.yellow.dim);
        // console.log(type, promise, reason);
        console.log('☆・[AntiCrash] | [MultipleResolves_Logs] | [end]・☆'.yellow.dim);
      });
      process.on('unhandledRejection', (reason, promise) => { // Needed
        console.log('☆・[AntiCrash] | [UnhandledRejection_Logs] | [start]・☆'.yellow.dim);
        console.log(reason);
        console.log('☆・[AntiCrash] | [UnhandledRejection_Logs] | [end]・☆'.yellow.dim);
      });
      process.on('rejectionHandled', (promise) => { // If You Want You Can Use
        console.log('☆・[AntiCrash] | [RejectionHandled_Logs] | [Start]・☆'.yellow.dim);
        console.log(promise);
        console.log('☆・[AntiCrash] | [RejectionHandled_Logs] | [End]・☆'.yellow.dim);
      })
      process.on("uncaughtException", (err, origin) => { // Needed
        console.log('☆・[AntiCrash] | [UncaughtException_Logs] | [Start]・☆'.yellow.dim);
        console.log(err);
        console.log('☆・[AntiCrash] | [UncaughtException_Logs] | [End]・☆'.yellow.dim);
      });
      process.on('uncaughtExceptionMonitor', (err, origin) => { // Needed
        console.log('☆・[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [Start]・☆'.yellow.dim);
        console.log(err);
        console.log('☆・[AntiCrash] | [UncaughtExceptionMonitor_Logs] | [End]・☆'.yellow.dim);
      });
      process.on('warning', (warning) => { // If You Want You Can Use
        console.log('☆・[AntiCrash] | [Warning_Logs] | [Start]・☆'.yellow.dim);
        console.log(warning);
        console.log('☆・[AntiCrash] | [Warning_Logs] | [End]・☆'.yellow.dim);
      });
      // process.on('SIGINT', () => { // If You Want You Can Use
      //   console.log('☆・[AntiCrash] | [SIGINT]・☆'.yellow.dim);
      // });
    
}