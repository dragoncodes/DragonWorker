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
#### Dependency Chain
``` typescript
constructor(){
        this.n = 15;
}

asyncSubTask2(){
        return 1;
}

asyncSubTask(){
        return this.n + 1 + this.asyncSubTask2();
}

asyncTest(): void {

        DragonWorker.runCode(this.asyncSubTask, this, { elapsedTime: true }).subscribe((e) => {
            console.log(e.data); // -> 17
            console.log(e.originalEvent);
            console.log(e.elapsedTime);
        });
    }

```

#### Passing Arguments
Note: Passing objects is not supported

``` typescript
constructor(){
        this.n = 15;
}

asyncSubTask(n: number){
        return this.n + 1 + n;
}

asyncTest(): void {

        DragonWorker.runCode(this.asyncSubTask, this, { elapsedTime: true, workerArguments: [this.n] }).subscribe((e) => {
            console.log(e.data); // -> 31
            console.log(e.originalEvent);
            console.log(e.elapsedTime);
        });
    }

```
