db.getCollection('assetdatas').aggregate([
{"$match": {
        "assetType": "ETF",
        "performanceData": {"$exists":true, "$ne": [], "$ne": null},
        }},
        {"$addFields":{
            "perfSize":{"$size":"$performanceData"}
            }},
         {"$match":
             {"perfSize": {'$gt':40}}
         },
        {"$project":{
          "_id":1,
          "name":"$name",
          "lastWeek": {$arrayElemAt: [ "$performanceData", 1 ]
              }
      }},
      {"$addFields":{
         "lastWeeksPricexVol":{$multiply: [ "$lastWeek.price", "$lastWeek.volume"]}
       }},
       {"$match":{"lastWeeksPricexVol": {"$gt":1000000}}},
       {"$project":{"name":"$name"}},
      {"$sort":{"name":-1}}
      ], 
      { "allowDiskUse": true }
      )