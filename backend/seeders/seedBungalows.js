require("dotenv").config();
const sequelize = require("../config/db");
const { Bungalow } = require("../models");

async function seedBungalows() {

  await sequelize.sync();

  const count =
    await Bungalow.count();

  if(count === 0){

    await Bungalow.bulkCreate([

      {
        name:"Kilinochchi Circuit Bungalow",
        location:"Kilinochchi"
      },

      {
        name:"Rathmalana Circuit Bungalow",
        location:"Rathmalana"
      },

      {
        name:"Athurugiriya Circuit Bungalow",
        location:"Athurugiriya"
      }

    ]);

    console.log(
      "Circuit Bungalows Seeded"
    );

  }

}

seedBungalows();