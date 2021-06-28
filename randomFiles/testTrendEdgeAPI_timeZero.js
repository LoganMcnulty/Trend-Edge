fastSMA = 10
slowSMA = 40
lookback = 5
fastWeight = .2
slowWeight = .2
fastOverSlowWeight = .2
macdWeight = .2
adxWeight = .2
slice=250
assetList = ["PTSI", "OPRX", "SGRY", "RBLX", "AFYA", "SPT", "BILL", "QFIN", "NPO", "SEER", "CLPT", "BRBR", "CSTL", "DAVA", "MLHR", "AVAV", "BCYC", "CVCO", "ZTS", "XPEL", "ACTG", "DOMO", "GBTC", "STAA", "TW", "IDYA", "PATH", "BOX", "ENTG", "NTNX", "MD", "VRNS", "AVLR", "PHG", "ACMR", "ARLO", "INFU", "KTCC", "SMPL", "WISH", "ISRG", "XP", "LI", "KLIC", "RVNC", "RAVN", "KTOS", "AVTR", "APTV", "OEF", "ST", "NOVA", "PEN", "CRSR", "STN", "TXG", "MGK", "CNXC", "IWF", "FTNT", "GPRO", "SYNA", "DIOD", "STNE", "RDY", "DDOG", "ACCD", "MDB", "GOOGL", "VICR"]


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
        "performanceData":{"$slice":["$performanceData", 250]},
        "lastUpdated": "$lastUpdated",
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
                      "$$perf.adx"
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
    }},
    { "$addFields":{
        "slowSMA": {"$switch": {
          "branches":[
            {"case":{
                  "$and":[
                    {"$gt":[{"$size": "$priceSeries"}, slowSMA]},
                    {"$ne":[{"$arrayElemAt":["$priceSeries", 0]}, false]},
              ]},
            "then":{
                "value":{"$round":[{"$avg":{"$slice": [ "$priceSeries", slowSMA ]}},2]},
                "lookbackValue":{
                     "$switch": {
                      "branches":[{
                        "case":
                          {"$and":[
                            {"$ne":[{"$arrayElemAt":["$priceSeries", slowSMA+lookback]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$priceSeries", slowSMA+lookback]}, false]}
                              ]}
                          , "then": 
                          {"$round":[{"$avg":{"$slice": [ "$priceSeries", lookback, slowSMA ]}},2]}
                        }
                          ],
                      "default":false
                }},
               "posSlope":{
                     "$switch": {
                      "branches":[{
                        "case":{"$and":[
                            {"$ne":[{"$arrayElemAt":["$priceSeries", slowSMA+lookback]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$priceSeries", slowSMA+lookback]}, false]}
                        ]}, 
                        "then": {
                             "$switch": {
                              "branches":[{
                                "case":{"$gt":[
                                    {"$avg":{"$slice": [ "$priceSeries", slowSMA ]}}, 
                                    {"$avg":{"$slice": [ "$priceSeries", lookback, slowSMA ]}}
                                    ]}, "then": 
                                  1
                                }
                                  ],
                              "default":0
                        }},
                        }],
                  "default":false
                }},
            }}
            ],
          "default":false
        }},
        "fastSMA": {"$switch": {
          "branches":[
            {"case":{
                  "$and":[
                    {"$gt":[{"$size": "$priceSeries"}, fastSMA]},
                    {"$ne":[{"$arrayElemAt":["$priceSeries", 0]}, false]},
              ]},
            "then":{
                "value":{"$round":[{"$avg":{"$slice": [ "$priceSeries", fastSMA ]}},2]},
                "lookbackValue":{
                     "$switch": {
                      "branches":[{
                        "case":
                          {"$and":[
                            {"$ne":[{"$arrayElemAt":["$priceSeries", fastSMA+lookback]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$priceSeries", fastSMA+lookback]}, false]}
                              ]}
                          , "then": 
                          {"$round":[{"$avg":{"$slice": [ "$priceSeries", lookback, fastSMA ]}},2]}
                        }
                          ],
                      "default":false
                }},
               "posSlope":{
                     "$switch": {
                      "branches":[{
                        "case":{"$and":[
                            {"$ne":[{"$arrayElemAt":["$priceSeries", fastSMA+lookback]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$priceSeries", fastSMA+lookback]}, false]}
                        ]}, 
                        "then": {
                             "$switch": {
                              "branches":[{
                                "case":{"$gt":[
                                    {"$avg":{"$slice": [ "$priceSeries", fastSMA ]}}, 
                                    {"$avg":{"$slice": [ "$priceSeries", lookback, fastSMA ]}}
                                    ]}, "then": 
                                  1
                                }
                                  ],
                              "default":0
                        }},
                        }],
                  "default":false
                }},
            }}
            ],
          "default":false
        }},
        "macd": {"$switch": {
          "branches":[
            {"case":{
                  "$and":[
                    {"$gt":[{"$size": "$macdSeries"}, 0]},
                    {"$ne":[{"$arrayElemAt":["$macdSeries", 0]}, false]},
              ]},
            "then":{
                "value":{"$round":[{"$arrayElemAt":["$macdSeries", 0]},2]},
                "lookbackValue":{
                     "$switch": {
                      "branches":[{
                        "case":
                          {"$and":[
                            {"$ne":[{"$arrayElemAt":["$macdSeries", lookback]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$macdSeries", lookback]}, false]}
                              ]}
                          , "then": 
                          {"$round":[{"$arrayElemAt":["$macdSeries", lookback]},2]}
                        }
                          ],
                      "default":false
                }},
               "posSlope":{
                     "$switch": {
                      "branches":[{
                        "case":{"$and":[
                            {"$ne":[{"$arrayElemAt":["$macdSeries", 0]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$macdSeries", 0]}, false]},
                            {"$ne":[{"$arrayElemAt":["$macdSeries", lookback]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$macdSeries", lookback]}, false]}
                        ]}, 
                        "then": {
                             "$switch": {
                              "branches":[{
                                "case":{"$gt":[
                                    {"$arrayElemAt":["$macdSeries", 0]}, 
                                   {"$arrayElemAt":["$macdSeries", lookback]}
                                    ]}, "then": 
                                  1
                                }
                                  ],
                              "default":0
                        }},
                        }],
                  "default":false
                }},
            }}
            ],
          "default":false
        }},
        "volume": {"$switch": {
          "branches":[
            {"case":{
                  "$and":[
                    {"$gt":[{"$size": "$volumeSeries"}, 0]},
                    {"$ne":[{"$arrayElemAt":["$volumeSeries", 0]}, false]},
              ]},
            "then":{
                "currValue":{"$arrayElemAt":["$volumeSeries", 0]},
                "fastAverageValue":{
                     "$switch": {
                      "branches":[{
                        "case":
                          {"$and":[
                            {"$ne":[{"$arrayElemAt":["$volumeSeries", fastSMA]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$volumeSeries", fastSMA]}, false]}
                              ]}
                          , "then":
                          {"$round":[{"$avg":{"$slice": ["$volumeSeries", fastSMA]}},2]}
                        }
                          ],
                      "default":false
                }},
                "currOverAverage":{
                     "$switch": {
                      "branches":[{
                        "case":
                          {"$and":[
                            {"$ne":[{"$arrayElemAt":["$volumeSeries", fastSMA]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$volumeSeries", fastSMA]}, false]}
                              ]}
                          , "then":
                          {"$round":[{"$divide":[
                            {"$arrayElemAt":["$volumeSeries", 0]},
                            {"$avg":{"$slice": ["$volumeSeries", fastSMA]}}
                          ]},2]}
                        }],
                      "default":false
                }},
                "fastAverageLookbackValue":{
                     "$switch": {
                      "branches":[{
                        "case":
                          {"$and":[
                            {"$ne":[{"$arrayElemAt":["$volumeSeries", fastSMA+lookback]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$volumeSeries", fastSMA+lookback]}, false]}
                              ]}
                          , "then":
                          {"$round":[{"$avg":{"$slice": ["$volumeSeries", lookback, fastSMA]}},2]}
                        }
                          ],
                      "default":false
                }},
                "avgVolPosSlope":{
                     "$switch": {
                      "branches":[{
                        "case":{"$and":[
                            {"$ne":[{"$arrayElemAt":["$volumeSeries", 0]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$volumeSeries", 0]}, false]},
                            {"$ne":[{"$arrayElemAt":["$volumeSeries", lookback+fastSMA]}, false]},
                            {"$ifNull":[{"$arrayElemAt":["$volumeSeries", lookback+fastSMA]}, false]}
                        ]}, 
                        "then": {
                             "$switch": {
                              "branches":[{
                                "case":{"$gt":[
                                    {"$avg":{"$slice": ["$volumeSeries", fastSMA]}}, 
                                   {"$avg":{"$slice": ["$volumeSeries", lookback, fastSMA]}}
                                    ]}, "then": 
                                  1
                                }
                                  ],
                              "default":0
                        }},
                        }],
                  "default":false
                }},
            }}
            ],
          "default":false
        }},
        }},
    {"$addFields":{
        "fastOverSlow":{
              "$switch": {
              "branches":[{
                "case":
                  {"$and":[
                    {"$ne":["$fastSMA.value", false]},
                    {"$ifNull":["$fastSMA.value", false]},
                    {"$ne":["$slowSMA.value", false]},
                    {"$ifNull":["$slowSMA.value", false]},
                      ]}
                  , "then":
                      {"$switch": {
                          "branches":[{
                            "case":
                              {"$and":[
                                {"$gt":["$fastSMA.value", "$slowSMA.value"]},
                                  ]}
                              , "then":
                              1
                            }
                              ],
                          "default":0
                    }}
                }
                  ],
              "default":false
        }},
      }},
    {"$project":{
      "_id":1,
      "name":1,
      "daysSinceIPO": {"$round":[{
          "$divide": [{ "$subtract": [new Date(), '$ipoDate'] }, 1000 * 60 * 60 * 24]
        },2]},
      "fastSMA":1,
      "slowSMA":1,
      "macd":1,
      "adx": {"$switch": {
        "branches":[{
          "case":
            {"$and":[
              {"$ne":["$fastOverSlow", false]},
              {"$ifNull":["$fastOverSlow", false]}
                ]}
            , "then":
            {"$round":[{"$arrayElemAt":["$adxSeries",0]},2]}
          }
            ],
        "default":0
      }},
      "volume":1,
      "priceCurr":{"$round":[{"$arrayElemAt":["$priceSeries",0]},2]},
      "priceSeries":1,
      "longName":1,
      "assetType":1,
      "ipoDate":1,
      "exchange":1,
//       "macdSeries":1,
      "lastUpdated":1,
      "fastOverSlow":1,
      "trendEdge" :
        {"$round" :[{ "$sum": [
            {"$switch": {
                  "branches":[{
                    "case":
                      {"$and":[
                        {"$ne":["$fastOverSlow", false]},
                        {"$ifNull":["$fastOverSlow", false]}
                          ]}
                      , "then":
                      {"$multiply": ["$fastOverSlow",fastOverSlowWeight]}, 
                    }
                      ],
                  "default":0
                }},
            {"$switch": {
                  "branches":[{
                    "case":
                      {"$and":[
                        {"$ne":["$fastSMA.posSlope", false]},
                        {"$ifNull":["$fastSMA.posSlope", false]}
                          ]}
                      , "then":
                      {"$multiply": ["$fastSMA.posSlope",fastWeight]}, 
                    }
                      ],
                  "default":0
                }},
            {"$switch": {
                  "branches":[{
                    "case":
                      {"$and":[
                        {"$ne":["$slowSMA.posSlope", false]},
                        {"$ifNull":["$slowSMA.posSlope", false]}
                          ]}
                      , "then":
                      { "$multiply": ["$slowSMA.posSlope", slowWeight] },
                    }
                      ],
                  "default":0
                }},
            {"$switch": {
                  "branches":[{
                    "case":
                      {"$and":[
                        {"$ne":["$macd.posSlope", false]},
                        {"$ifNull":["$macd.posSlope", false]}
                          ]}
                      , "then":
                      { "$multiply": [ "$macd.posSlope", macdWeight] },
                    }
                      ],
                  "default":0
                }},
            {"$switch": {
                  "branches":[{
                    "case":
                      {"$and":[
                        {"$eq":["$slowSMA.posSlope", 1]},
                        {"$ne":[{"$arrayElemAt":["$adxSeries", 0]}, false]},
                        {"$ifNull":[{"$arrayElemAt":["$adxSeries", 0]}, false]},
                          ]}
                      , "then":
                        { "$multiply": [{"$divide":[{"$arrayElemAt":["$adxSeries",0]},100]}, adxWeight] },
                    }
                      ],
                  "default":0
                }},
            ]
        }, 2]},
  }},
{"$sort":{"trendEdge":-1}}, 
])