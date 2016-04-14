# DragonWorker
Typescript wrapper for dynamic Web Workers


A pretty basic helper for simple async operations like parsing large JSON arrays.

## Examples

#### Basic Task
``` typescript 
performanceTest(): any {

        let n = 1000000;
        let i;
        for (i = 0; i < n; i++) {
            let a = new Date("2016-01-01");
            a.toString();
            a.toJSON().indexOf("01");
        }

        return i;
    }
    
    asyncTest(): void {
        let worker = new DragonWorker(this.performanceTest, this /* Needed for dependency resolve */);

        worker.run({ elapsedTime: true }).subscribe((e) => {
            console.log(e.data);
            console.log(e.originalEvent);
            console.log(e.elapsedTime);
        });
    }
```

OR 

``` typescript
asyncTest(): void {

        DragonWorker.runCode(this.performanceTest, this, { elapsedTime: true }).subscribe((e) => {
            console.log(e.data);
            console.log(e.originalEvent);
            console.log(e.elapsedTime);
        });
    }
```
