fastSMA = 10
slowSMA = 40
lookback = 5
fastWeight = .2
slowWeight = .2
fastOverSlowWeight = .2
macdWeight = .2
adxWeight = .2
assetList = ['TSLA', 'ARKK', 'QQQ', 'COIN', 'U', 'PUBM', 'MLHR']

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
        "macdSeries": {
            "$map": {
                "input": "$performanceData",
                "as": "el",
                "in": "$$el.macd"
            }
        },
        "adxSeries": {
            "$map": {
                "input": "$performanceData",
                "as": "el",
                "in": "$$el.adx"
            }
        },
        "priceSeries": {
            "$map": {
                "input": "$performanceData",
                "as": "el",
                "in": "$$el.price"
            }
        },
        "volumeSeries": {
            "$map": {
                "input": "$performanceData",
                "as": "el",
                "in": "$$el.volume"
            }
        },

    }},
    {
      "$addFields":
        {
        "fastSMA": {"$round":[{"$avg":{"$slice": [ "$priceSeries", fastSMA ]}}, 2]},
        "fastSMALookback": {"$avg":{"$slice": [ "$priceSeries", lookback, fastSMA ]}},
        "slowSMA": {"$round":[{"$avg":{"$slice": [ "$priceSeries", slowSMA ]}}, 2]},
        "slowSMALookback": {"$avg":{"$slice": [ "$priceSeries", lookback, slowSMA ]}},
        "macd": {"$round":[{"$avg":{"$slice": [ "$macdSeries", 1]}}, 2]},
        "macdLookback": {"$avg":{"$slice": [ "$macdSeries", lookback, 1]}},
        "adx": {"$round":[{"$avg":{"$slice": [ "$adxSeries", 1]}}, 2]},
        "volumeCurr": {"$avg":{"$slice": [ "$volumeSeries", 1]}},
        "volumeAvg": {"$avg":{"$slice": [ "$volumeSeries", 10]}},
        "volumeLookbackAvg": {"$avg":{"$slice": [ "$volumeSeries", lookback, 10]}},
        "priceCurr": {"$round":[{"$avg":{"$slice": [ "$priceSeries", 1]}}, 2]},
        "enoughSlowData": {"$switch": {
          "branches":[{
            "case":{"$gt":[{$size: "$priceSeries"} , slowSMA + lookback]}, "then": true}
              ],
          "default":false
        }},
        "enoughFastData": {"$switch": {
          "branches":[{
            "case":{"$gt":[{$size: "$priceSeries"} , fastSMA + lookback]}, "then": true}
              ],
          "default":false
        }},
        "enoughMACDData": {"$switch": {
          "branches":[{
            "case":{"$gt":[{$size: "$priceSeries"} , lookback]}, "then": true}
              ],
          "default":false
        }},
        },
    },
    {
      "$addFields":
      {
      "fastOverSlow":{
          "$switch":{
              "branches":[{
                  "case":{"$gt":["$fastSMA","$slowSMA"]},then:1}
                    ],
                "default":0
                  }},
      "fastPosSlope":{
          "$switch":{
              "branches":[{
                  "case":{"$gt":["$fastSMA","$fastSMALookback"]},then:1}
                    ],
                "default":0
                  }},
      "slowPosSlope":{
          "$switch":{
              "branches":[{
                  "case":{"$gt":["$slowSMA","$slowSMALookback"]},then:1}
                    ],
                "default":0
                  }},
      "macdPosSlope":{
          "$switch":{
              "branches":[{
                  "case":{"$gt":["$macd","$macdLookback"]},then:1}
                    ],
                "default":0
                  }},
        "adxTrue":{
          "$switch":{
              "branches":[{
                  "case":{"$gt":["$slowSMA","$slowSMALookback"]},then:{"$divide":["$adx",100]}}
                    ],
                "default":0
                }},
          },
    },
    {"$project":{
      "_id":1,
      "name":1,
      "daysSinceIPO": {
          "$divide": [{ "$subtract": [new Date(), '$ipoDate'] }, 1000 * 3600 * 24]
        },
      "fastSMA":1,
      "fastSMALookback":1,
      "slowSMA":1,
      "slowSMALookback":1,
      "macd":1,
      "macdLookback":1,
      "adx":1,
      "volumeCurr":1,
      "volumeAvg":1,
      "volumeLookbackAvg":1,
      "priceCurr":1,
      "priceSeries":1,
      "adxTrue": 1,
      "fastOverSlow": 1,
      "fastPosSlope": 1,
      "slowPosSlope": 1,
      "macdPosSlope": 1,
      "longName":1,
      "macdLookback":1,
      "smaLookback": 1,
      "assetType":1,
      "ipoDate":1,
      "exchange":1,
      "adxTrue": 1,
      "enoughSlowData": 1,
      "enoughFastData": 1,
      "enoughMACDData": 1,
      "macdSeries":1,
      
      
      "trendEdge" :
      {
        "$switch":{
          "branches":[{
              "case":{"$and":[{ "$eq": [ "$enoughFastData", true ]}, { "$eq": [ "$enoughSlowData", true ]}, { "$eq": [ "$enoughMACDData", true ]}]},         
                "then":
                  {"$round" :[{ "$sum": [ { "$multiply": [ "$fastOverSlow", fastOverSlowWeight] }, { "$multiply": [ "$fastPosSlope", fastWeight] }, { "$multiply": ["$slowPosSlope", slowWeight] },
                  { "$multiply": [ "$macdPosSlope", macdWeight] }, { "$multiply": [ "$adxTrue", adxWeight] } ]
                  }, 3]},
 
            // Case 2
               "case":{"$and":[{ "$eq": [ "$enoughFastData", true ]}, { "$eq": [ "$enoughMACDData", true ]}]},
               "then":
                 {"$round" :[{ "$sum": [{ "$multiply": [ "$fastPosSlope", fastWeight] }, { "$multiply": [ "$macdPosSlope", macdWeight] }]
                 }, 3]},
                 
            // Case 2
               "case":{"$and":[{ "$eq": [ "$enoughFastData", true ]}]},
               "then":
                 {"$round" :[{ "$sum": [{ "$multiply": [ "$fastPosSlope", fastWeight] }]
                 }, 3]},
                 
            }],
        "default":0}},
  }},
{"$sort":{"trendEdge":-1}}, 
])