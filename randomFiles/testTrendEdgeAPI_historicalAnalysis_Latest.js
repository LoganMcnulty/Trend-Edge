fastSMA = 10
slowSMA = 40
lookback = 5
fastWeight = .2
slowWeight = .2
fastOverSlowWeight = .2
macdWeight = .2
adxWeight = .2
slice = 250

assetList=['CRSR','MDB','ESTC','SNOW','RBLX','COIN', 'MLHR']

db.getCollection('assetdatas').aggregate([
     {"$match": {
      "name": { "$in": assetList },
      "performanceData": {"$exists":true, "$ne": [], "$ne": null},
      }},
      {"$project":{
        "_id":1,
        "name":"$name",
        "lastUpdated": "$lastUpdated",
//           "performanceData":"$performanceData",
        "volumeSeries":{"$map":{
              "input": {"$slice":["$performanceData", slice]},
              "as": "perf",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$ne":["$$perf.volume" , null]}, "then": 
                      "$$perf.volume"
                    }
                      ],
                  "default":false
                }}
           }},
        "macdSeries":{"$map":{
              "input": {"$slice":["$performanceData", slice]},
              "as": "perf",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$ne":["$$perf.macd" , null]}, "then": 
                      "$$perf.macd"
                    }
                      ],
                  "default":false
                }}
           }},
        "dateSeries":{"$map":{
              "input": {"$slice":["$performanceData", slice]},
              "as": "perf",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$ne":["$$perf.date" , null]}, "then": 
                      "$$perf.date"
                    }
                      ],
                  "default":false
                }}
           }},
        "adxSeries":{"$map":{
              "input": {"$slice":["$performanceData", slice]},
              "as": "perf",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$ne":["$$perf.adx" , null]}, "then": 
                      {"$divide":["$$perf.adx",100]}
                    }
                      ],
                  "default":false
                }}
           }},
        "priceSeries":{"$map":{
              "input": {"$slice":["$performanceData", slice]},
              "as": "perf",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$ne":["$$perf.price" , null]}, "then": 
                      "$$perf.price"
                    }
                      ],
                  "default":false
                }}
           }},
      }},
    { "$addFields":{ 
        "fastSMA":
           {"$map":{
              "input": "$priceSeries",
              "as": "price",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$and":[
                        {"$gte":[{"$subtract":[{"$size": "$priceSeries"},{"$indexOfArray": [ "$priceSeries", "$$price" ]}]} , fastSMA]}
                        ]}
                      , 
                      "then": 
                      {"$round":[{"$avg":{"$slice": [ "$priceSeries", {"$indexOfArray": [ "$priceSeries", "$$price" ]}, parseFloat(fastSMA) ]}}, 4]}
                    }
                      ],
                  "default":false
                }}
           }},
        "volumeSMA":
           {"$map":{
              "input": "$volumeSeries",
              "as": "volume",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$and":[
                        {"$gte":[{"$subtract":[{"$size": "$volumeSeries"},{"$indexOfArray": [ "$volumeSeries", "$$volume" ]}]} , fastSMA]}
                        ]}
                      , 
                      "then": 
                      {"$round":[{"$avg":{"$slice": [ "$volumeSeries", {"$indexOfArray": [ "$volumeSeries", "$$volume" ]}, parseFloat(fastSMA) ]}}, 4]}
                    }
                      ],
                  "default":false
                }}
           }},
        "slowSMA":
           {"$map":{
              "input": "$priceSeries",
              "as": "price",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$gte":[{$subtract:[{"$size": "$priceSeries"},{"$indexOfArray": [ "$priceSeries", "$$price" ]}]} , slowSMA]}, "then": 
                      {"$round":[{"$avg":{"$slice": [ "$priceSeries", {"$indexOfArray": [ "$priceSeries", "$$price" ]}, parseFloat(slowSMA) ]}}, 4]}
                    }
                      ],
                  "default":false
                }}
           }},
}},
{
  "$addFields":
  {
    "trendEdgeVector":
       {"$map":{
          "input": "$fastSMA",
          "as": "fastIndex",
          "in": {
              "$switch": {
              "branches":[
                  {"case":{"$and":[
                    {"$ne":["$$fastIndex",false]},
                    {"$ne":[{"$arrayElemAt":["$fastSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                    
                    {"$ne":[{"$arrayElemAt":["$slowSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$slowSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                    
                    {"$ne":[{"$arrayElemAt":["$macdSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$macdSeries", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                    
                    {"$ne":[{"$arrayElemAt":["$volumeSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$volumeSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                    
                    {"$ne":[{"$arrayElemAt":["$volumeSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$volumeSeries", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                    
                    {"$ne":[{"$arrayElemAt":["$adxSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    ]}, "then":
                    {
                        "complete":true,
                        "date":{"$arrayElemAt":["$dateSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                        "price":{"$arrayElemAt":["$priceSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                        "volumeCurr":{"$arrayElemAt":["$volumeSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                        "volumeAvg":{"$arrayElemAt":["$volumeSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                        "value":  {"$round" :[
                            { "$sum": [
                               {"$switch": {
                                  "branches":[{
                                    "case":
                                      {"$gt":["$$fastIndex" , {"$arrayElemAt":["$fastSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}, lookback]}]}]}, "then": 
                                      { "$multiply": [ 1, fastWeight] }
                                    }
                                      ],
                                  "default":0
                                }},
                                
                               {"$switch": {
                                  "branches":[{
                                    "case":
                                      {"$gt":[{"$arrayElemAt":["$slowSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, 
                                      {"$arrayElemAt":["$slowSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}
                                      ]}, "then": 
                                      { "$multiply": [ 1, slowWeight] }
                                    }
                                      ],
                                  "default":0
                                }},
                                
                              {"$switch": {
                                  "branches":[{
                                    "case":
                                      {"$gt":["$$fastIndex", {"$arrayElemAt":["$slowSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}
                                      ]}, "then": 
                                      { "$multiply": [ 1, fastOverSlowWeight] }
                                    }
                                      ],
                                  "default":0
                                }},
                              {"$switch": {
                                  "branches":[{
                                    "case":
                                      {"$gt":[
                                          {"$arrayElemAt":["$macdSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, 
                                          {"$arrayElemAt":["$macdSeries", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}
                                      ]}, "then": 
                                      { "$multiply": [ 1, macdWeight] }
                                    }
                                      ],
                                  "default":0
                                }},
                               {"$switch": {
                                  "branches":[{
                                    "case":
                                      {"$and":[
                                        {"$gt":[{"$arrayElemAt":["$slowSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, 
                                        {"$arrayElemAt":["$slowSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]},
                                        ]},
                                        {"$ne":[{"$arrayElemAt":["$adxSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                                        {"$ifNull":[{"$arrayElemAt":["$adxSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                                      ]}, 
                                      "then": 
                                      { "$multiply": [ {"$arrayElemAt":["$adxSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, slowWeight] }
                                    }
                                      ],
                                  "default":0
                                }},
                                ]
                        }, 2]}
                        },
                        },
                  ],
                "default": 
                  {"$switch": {
                        "branches":[{
                          "case":{"$and":[
                          {"$ne":["$$fastIndex",false]},
                          {"$ne":[{"$arrayElemAt":["$fastSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                          {"$ne":[{"$arrayElemAt":["$macdSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                          {"$ne":[{"$arrayElemAt":["$macdSeries", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                          
                            {"$ne":[{"$arrayElemAt":["$volumeSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                            {"$ne":[{"$arrayElemAt":["$volumeSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},
                            
                            {"$ne":[{"$arrayElemAt":["$volumeSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                            {"$ne":[{"$arrayElemAt":["$volumeSeries", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}, false]},

                          
                          ]}, "then": 
                                {"complete":"macd_Fast",
                                    "date":{"$arrayElemAt":["$dateSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                                    "price":{"$arrayElemAt":["$priceSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                                    "volumeCurr":{"$arrayElemAt":["$volumeSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                                    "volumeAvg":{"$arrayElemAt":["$volumeSMA", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},
                                    "value":{"$round" :[
                                      { "$sum": [
                                        {"$switch": {
                                            "branches":[{
                                              "case":
                                                {"$gt":["$$fastIndex" , {"$arrayElemAt":["$fastSMA", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}, lookback]}]}]}, "then": 
                                                { "$multiply": [ 1, fastWeight] }
                                              }
                                                ],
                                            "default":0
                                          }},
                                        {"$switch": {
                                            "branches":[{
                                              "case":
                                                {"$gt":[
                                                    {"$arrayElemAt":["$macdSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, 
                                                    {"$arrayElemAt":["$macdSeries", {"$add":[{"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]},lookback]}]}
                                                ]}, "then": 
                                                { "$multiply": [ 1, macdWeight] }
                                              }
                                                ],
                                            "default":0
                                          }},
                                          ]
                                  }, 2]}
                                }
                              }
                            ],
                        "default":{
                            "complete":false,
                            "date":{"$arrayElemAt":["$dateSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, 
                            "value":false
                            }
                      }},         
                  }},
          }},
}},
    {"$project":{
      "_id":1,
      "name":1,
      "trendEdgeVector":1,
  }},
{"$sort":{"name":-1}}
])