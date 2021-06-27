fastSMA = 10
slowSMA = 40
lookback = 5
fastWeight = .2
slowWeight = .2
fastOverSlowWeight = .2
macdWeight = .2
adxWeight = .2

assetList = ["PTSI", "OPRX", "SGRY", "RBLX", "AFYA", "SPT", "BILL", "QFIN", "NPO", "SEER", "CLPT", "BRBR", "CSTL", "DAVA", "MLHR", "AVAV", "BCYC", "CVCO", "ZTS", "XPEL", "ACTG", "DOMO", "GBTC", "STAA", "TW", "IDYA", "PATH", "BOX", "ENTG", "NTNX", "MD", "VRNS", "AVLR", "PHG", "ACMR", "ARLO", "INFU", "KTCC", "SMPL", "WISH", "ISRG", "XP", "LI", "KLIC", "RVNC", "RAVN", "KTOS", "AVTR", "APTV", "OEF", "ST", "NOVA", "PEN", "CRSR", "STN", "TXG", "MGK", "CNXC", "IWF", "FTNT", "GPRO", "SYNA", "DIOD", "STNE", "RDY", "DDOG", "ACCD", "MDB", "GOOGL", "VICR", "DBX", "PGNY", "HACK", "BAND", "WK", "VFF", "SNOW", "SSTI", "CRNC", "IEA", "FUTU", "QCOM", "OGIG", "INTU", "NVCR", "HCAT", "SUMR", "PSTG", "AXNX", "CHWY", "JAZZ", "QTRX", "AVNW", "AXON", "CYRX", "FOUR", "CROX", "ESTC", "MGIC", "PANW"
  ,'COIN',
  ]

db.getCollection('assetdatas').aggregate([
 {"$match": {
      "name": { "$in": assetList },
      "performanceData": {"$exists":true, "$ne": [], "$ne": null},
      }},
      {"$project":{
        "_id":1,
        "name":"$name",
        "longName":"$longName",
        "assetType":"$assetType",
        "ipoDate":"$ipoDate",
        "exchange":"$exchange",
        "performanceData":{"$slice":["$performanceData", 200]},
        "lastUpdated": "$lastUpdated",
      }},
 {"$addFields":{
    "macdSeries":{"$map":{
              "input": "$performanceData",
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
        "adxSeries": {
          "$filter": {
           "input": {
            "$map": {
                "input": "$performanceData",
                "as": "el",
                "in": "$$el.adx"
            }},
           "as": "num",
           "cond": {"$ne":["$$num" , null]}
        }},
        "priceSeries":{"$map":{
              "input": "$performanceData",
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
        "volumeSeries":{"$map":{
              "input": "$performanceData",
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
     
 }},
    { "$addFields":{ 
        "fastSMA":
           {"$map":{
              "input": "$priceSeries",
              "as": "price",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$gte":[{"$subtract":[{"$size": "$priceSeries"},{"$indexOfArray": [ "$priceSeries", "$$price" ]}]} , fastSMA]}, "then": 
                      {"$round":[{"$avg":{"$slice": [ "$priceSeries", {"$indexOfArray": [ "$priceSeries", "$$price" ]}, parseFloat(fastSMA) ]}}, 4]}
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
        "averageVolume":
           {"$map":{
              "input": "$volumeSeries",
              "as": "vol",
              "in": { 
                  "$switch": {
                  "branches":[{
                    "case":{"$gte":[{"$subtract":[{"$size": "$volumeSeries"},{"$indexOfArray": [ "$volumeSeries", "$$vol" ]}]} , 10]}, "then": 
                      {"$round":[{"$avg":{"$slice": [ "$volumeSeries", {"$indexOfArray": [ "$volumeSeries", "$$vol" ]}, 10]}}, 3]}
                    }
                      ],
                  "default":false
                }}
           }},
}},
{
  "$addFields":
  {
     "fastOverSlowVector":
       {"$map":{
          "input": "$slowSMA",
          "as": "slow",
          "in": { 
              "$switch": {
              "branches":[
                  {"case":{"$and":[
                    {"$ne":["$$slow",false]},
                    {"$ne":[{"$arrayElemAt":["$fastSMA", {"$indexOfArray":[ "$slowSMA", "$$slow" ]}]},false]},
                    {"$gt":[                          
                        {"$arrayElemAt":["$fastSMA", {"$indexOfArray":[ "$slowSMA", "$$slow" ]}]}
                        , "$$slow"]
                      }
                    ]
                    }, "then":1},
                    {"case":{"$and":[
                        {"$ne":["$$slow",false]},
                        {"$ne":[{"$arrayElemAt":["$fastSMA", {"$indexOfArray":[ "$slowSMA", "$$slow" ]}] },false]},
                        {
                        "$lte":[
                            {"$arrayElemAt":["$fastSMA", {"$indexOfArray":[ "$slowSMA", "$$slow" ]}]}
                            , "$$slow"]
                          }
                    ]
                    }, "then":0},
                  ],
              "default":false
            }},
        }},
     "fastLookBackVector":
       {"$map":{
          "input": "$fastSMA",
          "as": "fast",
          "in": { 
              "$switch": {
              "branches":[
                  {"case":{"$and":[
                    {"$ne":["$$fast",false]},
                    {"$ne":[{"$arrayElemAt":["$fastSMA", { "$add": [{"$indexOfArray":[ "$fastSMA", "$$fast" ]}, lookback] }]},false]},
                    {"$ifNull":[{"$arrayElemAt":["$fastSMA", { "$add": [{"$indexOfArray":[ "$fastSMA", "$$fast" ]}, lookback] }]},false]},
                    {
                      "$gt":[
                        "$$fast"
                        , {"$arrayElemAt":["$fastSMA", { "$add": [{"$indexOfArray":[ "$fastSMA", "$$fast" ]}, lookback] }]}]  
                      }
                    ]
                    }, "then":1},
                  {"case":{"$and":[
                    {"$ne":["$$fast",false]},
                    {"$ne":[{"$arrayElemAt":["$fastSMA", { "$add": [{"$indexOfArray":[ "$fastSMA", "$$fast" ]}, lookback] }]},false]},
                    {"$ifNull":[{"$arrayElemAt":["$fastSMA", { "$add": [{"$indexOfArray":[ "$fastSMA", "$$fast" ]}, lookback] }]},false]},
                    {
                      "$lte":[
                        "$$fast"
                        , {"$arrayElemAt":["$fastSMA", { "$add": [{"$indexOfArray":[ "$fastSMA", "$$fast" ]}, lookback] }]}]  
                      }
                    ]
                    }, "then":0},
                  ],
              "default":false
            }}
       }},
     "slowLookBackVector":
       {"$map":{
          "input": "$slowSMA",
          "as": "slow",
          "in": { 
              "$switch": {
              "branches":[
                  {"case":{"$and":[
                    {"$ne":["$$slow",false]},
                    {"$ne":[{"$arrayElemAt":["$slowSMA", { "$add": [{"$indexOfArray":[ "$slowSMA", "$$slow" ]}, lookback] }]},false]},
                    {"$ifNull":[{"$arrayElemAt":["$slowSMA", { "$add": [{"$indexOfArray":[ "$slowSMA", "$$slow" ]}, lookback] }]},false]},
                    {
                      "$gt":[
                        "$$slow"
                        , {"$arrayElemAt":["$slowSMA", { "$add": [{"$indexOfArray":[ "$slowSMA", "$$slow" ]}, lookback] }]}]  
                      }
                    ]
                    }, "then":1},
                  {"case":{"$and":[
                    {"$ne":["$$slow",false]},
                    {"$ne":[{"$arrayElemAt":["$slowSMA", { "$add": [{"$indexOfArray":[ "$slowSMA", "$$slow" ]}, lookback] }]},false]},
                    {"$ifNull":[{"$arrayElemAt":["$slowSMA", { "$add": [{"$indexOfArray":[ "$slowSMA", "$$slow" ]}, lookback] }]},false]},
                    {
                      "$lte":[
                        "$$slow"
                        , {"$arrayElemAt":["$slowSMA", { "$add": [{"$indexOfArray":[ "$slowSMA", "$$slow" ]}, lookback] }]}]  
                      }
                    ]
                    }, "then":0},
                  ],
              "default":false
            }},
       }},
  "macdVector":
       {"$map":{
          "input": "$macdSeries",
          "as": "macd",
          "in": {
              "$switch": {
              "branches":[
                  {"case":{"$and":[
                    {"$ne":["$$macd",false]},
                    {"$ifNull":[{"$arrayElemAt":["$macdSeries", { "$add": [{"$indexOfArray":[ "$macdSeries", "$$macd" ]}, lookback] }]}, false]},
                    {
                      "$gt":[
                        "$$macd"
                        , {"$arrayElemAt":["$macdSeries", { "$add": [{"$indexOfArray":[ "$macdSeries", "$$macd" ]}, lookback] }]}]  
                      }
                    ]
                    }, "then":1},
                  {"case":{"$and":[
                    {"$ne":["$$macd",false]},
                    {"$ifNull":[{"$arrayElemAt":["$macdSeries", { "$add": [{"$indexOfArray":[ "$macdSeries", "$$macd" ]}, lookback] }]}, false]},
                    {
                      "$lte":[
                        "$$macd"
                        , {"$arrayElemAt":["$macdSeries", { "$add": [{"$indexOfArray":[ "$macdSeries", "$$macd" ]}, lookback] }]}]  
                      }
                    ]
                    }, "then":0},
                  ],
              "default":false
            }},
          }},
}},
{
  "$addFields":{
       "trendEdgeTotalVector":
       {"$map":{
          "input": "$fastSMA",
          "as": "fastIndex",
          "in": {
              "$switch": {
              "branches":[
                  {"case":{"$and":[
                    {"$ne":["$$fastIndex",false]},
                    {"$ne":[{"$arrayElemAt":["$fastOverSlowVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$fastLookBackVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$slowLookBackVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$macdVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    {"$ne":[{"$arrayElemAt":["$adxSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                    ]
                    }, "then":
                        {"$round" :[
                            { "$sum": [
                                { "$multiply": [ {"$arrayElemAt":["$fastOverSlowVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, fastOverSlowWeight] }, 
                                { "$multiply": [ {"$arrayElemAt":["$fastLookBackVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, fastWeight] }, 
                                { "$multiply": [{"$arrayElemAt":["$slowLookBackVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, slowWeight] },
                                { "$multiply": [ {"$arrayElemAt":["$macdVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, macdWeight] },
                                {"$switch": {
                                  "branches":[{
                                    "case":{"$eq":[{"$arrayElemAt":["$slowLookBackVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]} , 1]}, "then": 
                                      { "$multiply": [ {"$divide":[{"$arrayElemAt":["$adxSeries", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]},100]}, adxWeight] }
                                    }
                                      ],
                                  "default":0
                                }}
                                ]
                        }, 4]}
                        },
                  ],
              "default":false
            }},
          }},
       "trendEdgeMacdFastVector":
           {"$map":{
              "input": "$fastSMA",
              "as": "fastIndex",
              "in": {
                  "$switch": {
                  "branches":[
                      {"case":{"$and":[
                        {"$ne":["$$fastIndex",false]},
                        {"$ne":[{"$arrayElemAt":["$fastLookBackVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                        {"$ne":[{"$arrayElemAt":["$macdVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                        {"$ifNull":[{"$arrayElemAt":["$macdVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, false]},
                        ]
                        }, "then":
                            {"$round" :[
                                { "$sum": [
                                    { "$multiply": [ {"$arrayElemAt":["$fastLookBackVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, fastWeight] }, 
                                    { "$multiply": [ {"$arrayElemAt":["$macdVector", {"$indexOfArray":[ "$fastSMA", "$$fastIndex" ]}]}, macdWeight] },
                                    ]
                            }, 4]}
                            },
                      ],
                  "default":false
                }},
              }},
      },
},
    {"$project":{
      "_id":1,
      "name":1,
      "daysSinceIPO": {
          "$divide": [{ "$subtract": [new Date(), '$ipoDate'] }, 1000 * 60 * 60 * 24]
        },
      "fastSMA":{"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$fastSMA", 0]}, false]},
                            ]
                          }, 
                          "then":{"$round":[{"$arrayElemAt":["$fastSMA", 0]},2]}
                          },
   
                      ],
                  "default":false
                }},
      "slowSMA":{"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$slowSMA", 0]}, false]},
                            ]
                          }, 
                          "then":{"$round":[{"$arrayElemAt":["$slowSMA", 0]},2]}
                          },
   
                      ],
                  "default":false
                }},
//       "fastLookBackVector":1,
//       "fastOverSlowVector":1,
//       "slowLookBackVector":1,
      "macd": {"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$macdSeries", 0]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$macdSeries", 0]}, false]},
                            ]
                          }, 
                          "then":{"$round":[{"$arrayElemAt":["$macdSeries", 0]},2]}
                          },
   
                      ],
                  "default":false
                }},
      "adx": {"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$adxSeries", 0]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$adxSeries", 0]}, false]},
                            ]
                          }, 
                          "then":{"$round":[{"$arrayElemAt":["$adxSeries", 0]},2]}
                          },
   
                      ],
                  "default":false
                }},
      "fastPosSlope": {"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$fastLookBackVector", 0]}, false]},
                            ]
                          }, 
                          "then":{"$arrayElemAt":["$fastLookBackVector", 0]}
                          },
                      ],
                  "default":false
                }},
      "slowPosSlope": {"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$slowLookBackVector", 0]}, false]},
                            ]
                          }, 
                          "then":{"$arrayElemAt":["$slowLookBackVector", 0]}
                          },
                      ],
                  "default":false
                }},
      "macdPosSlope": {"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$macdVector", 0]}, false]},
                            ]
                          }, 
                          "then":{"$arrayElemAt":["$macdVector", 0]}
                          },
                      ],
                  "default":false
                }},
      "volumeAvg": {"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$averageVolume", 0]}, false]},
                            ]
                          }, 
                          "then":{"$round":[{"$arrayElemAt":["$averageVolume", 0]},2]}
                          },
                      ],
                  "default":false
                }},
      "volumeCurr": {"$arrayElemAt":[ "$volumeSeries", 0]},
      "priceCurr": {"$round":[{"$arrayElemAt":[ "$priceSeries", 0]}, 2]},
//       "priceSeries":1,
      "longName":1,
      "assetType":1,
      "ipoDate":1,
      "exchange":1,
      "lastUpdated":1,
      "trendEdgeTotalVector":1,
      "trendEdgeMacdFastVector":1,
      "trendEdge": {"$switch": {
                  "branches":[
                      {"case":{
                          "$and":[
                            {"$ne":[{"$arrayElemAt":["$trendEdgeTotalVector", 0]}, false]},
                            ]
                          }, 
                          "then":{"$round":[{"$arrayElemAt":["$trendEdgeTotalVector", 0]},2]}
                          },
                      {"case":{
                          "$and":[
                            {"$eq":[{"$arrayElemAt":["$trendEdgeTotalVector", 0]}, false]},
                            {"$ne":[{"$arrayElemAt":["$trendEdgeMacdFastVector", 0]}, false]},
                            ]
                          }, 
                          "then":{"$round":[{"$arrayElemAt":["$trendEdgeMacdFastVector", 0]},2]}
                          },
                      ],
                  "default":0
                }},
      "totalData": {"$switch": {
              "branches":[
                  {"case":{
                      "$and":[
                        {"$ne":[{"$arrayElemAt":["$trendEdgeTotalVector", 0]}, false]},
                        ]
                      }, 
                      "then":true
                      },
                  ],
              "default":false
            }},
      "macdFastData": {"$switch": {
              "branches":[
                  {"case":{
                      "$and":[
                        {"$eq":[{"$arrayElemAt":["$trendEdgeTotalVector", 0]}, false]},
                        {"$ne":[{"$arrayElemAt":["$trendEdgeMacdFastVector", 0]}, false]},
                        ]
                      }, 
                      "then":true
                      },
                  ],
              "default":false
            }},
//             "macdSeries":1,
  }},
{"$sort":{"trendEdge":-1}}
])