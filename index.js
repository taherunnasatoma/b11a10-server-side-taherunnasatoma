const express = require('express');
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app= express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i41acjo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const roommatesCollection = client.db('roommateDB').collection('roommates')

    app.get('/roommates',async(req,res)=>{
      const cursor = roommatesCollection.find();
      const result=await cursor.toArray()
      res.send(result)
    })

    app.get('/roommates/:id',async(req,res)=>{
      const id=req.params.id;
      const query= {_id:new ObjectId(id)}
      const result =await roommatesCollection.findOne(query);
      res.send(result)

    })

    app.post('/roommates',async(req,res)=>{
        const newRoommate = req.body;
        console.log(newRoommate)
        const result = await roommatesCollection.insertOne(newRoommate);
        res.send(result);
    })

    app.put('/roommates/:id',async(req,res)=>{
      const id = req.params.id;
      const filter={_id:new ObjectId(id)}
      const options = {upsert :true};
      const updatedRoommate = req.body;
      const updatedDoc ={
        $set:updatedRoommate

      }

      const result = await roommatesCollection.updateOne(filter,updatedDoc,options)
      
      res.send(result);

    })

    app.delete('/roommates/:id',async(req,res)=>{
      const id =req.params.id;

      const query={_id:new ObjectId(id)}
      const result= await roommatesCollection.deleteOne(query);
      res.send(result)
    })


    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Roommate is finding')
});

app.listen(port,()=>{
    console.log(`Roommate finding server in running on port ${port}`)
})
