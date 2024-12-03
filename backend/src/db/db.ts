import mongoose from 'mongoose';

function connectToDb(){
   mongoose.connect(process.env.DB_CONNECT as string).then(()=>{
    console.log('Connected to db');
   }).catch((err)=>{
    console.log(err);
   })
     
}

export default connectToDb;