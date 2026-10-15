const stu=["Priya","Arun","Divya","Rahul","Sneha"]
console.log(stu[0])
console.log(stu[stu.length-1])
stu.push("Karthick")
console.log(stu)
stu.pop()
console.log(stu)
a=stu.slice(1,4);
console.log(a)
b=stu.splice(2,0);
console.log(b)


const a=[10,20,30]
const b= a.map(i=> i* 20);



console.log(a);
console.log(b);


let st=[40,10,5,20,30]
let re=st.sort((a,b)=>b-a)
console.log(re);

let nu=[10,20,30,40]
let res=nu.reduce((total,num)=>{
  return total+num;
});
console.log(res);