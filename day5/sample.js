greet();
function greet(){
  console.log("rint");
};

//CLOSURE

function acc(){
  let bal=1000;
  function dep(amo){
    bal+=amo
    console.log("balance amount "+ bal); 
  }
  return dep;
}
const myacc = acc();
myacc(500);
myacc(700);