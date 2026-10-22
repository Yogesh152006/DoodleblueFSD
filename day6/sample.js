
// //     // async and await with promice
// // function getdata(){
// //     return new Promise((resolve)=>{
// //         setTimeout(()=>{
// //             resolve("Data recived");
// //         },2000);
// //     });
// // }
// // async function displayData(){
// //     console.log("Start");
// //     const result = await getdata();

// //     console.log(result);
// //     console.log("End");
// // }

// // displayData();


// // // promise with then , catch and finally 

// // const addmission = new Promise((resolve,reject) => {
// //     const payment=true;
// //     if (payment == true){
// //         resolve(" Payment Succesfull");
// //     } else{
// //         reject(new Error ("Payment Failed"))
// //     }
// // });

// // addmission
// //     .then((result)=> console.log(result))
// //     .catch((error)=> console.log(error.message))
// //     .finally(()=>console.log("task done"))


// // // practice

// // console.log("one");
// // setTimeout(() => console.log("two"),0);
// // console.log("three");


// setTimeout(() => console.log("Registration conformed"),3000);
// console.log("Registration recived");


// console.log("start");
// setTimeout(()=> console.log("Timer"),0);
// Promise.resolve().then(()=> console.log("Promise"));
// console.log("End")



// bank task 

function withdrawmoney(balance,amount){
    return new Promise ((resolve,reject)=> {
        if(amount <= balance){
            resolve("Withdrawel succesfully done ")
        }
        else{
            reject("Insufficent Balance ")
        }
    },2000);
}

async function checkmoney(balance,amount){
try{
    const a = await withdrawmoney(balance,amount);
    console.log(a);
}
catch(error){
    console.log(error);
}
finally{
    console.log("transcation completed , tq visit again ");
}
}

checkmoney(1000,5000);



// age and movie age check 



function checkage(age,rating){
    return new Promise ((resolve,reject)=> {
        if(rating === "18+" & age < 18){
            reject("Acesss Denied")
        }
        else{
            reject("Acesss permited u can watch moviee")
        }
    },1000);
}

async function moviecheck(age,rating){
try{
    const b = await checkage(age,rating);
    console.log(b);
}
catch(error){
    console.log(error);
}
}

moviecheck(20,"18+");