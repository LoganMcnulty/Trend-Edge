fastSMA = 10
slowSMA = 40
lookback = 5
fastWeight = .2
slowWeight = .2
fastOverSlowWeight = .2
macdWeight = .2
adxWeight = .2
assetList = ['QQQ', 'CRSR', 'COIN', 'RBLX']

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
            "$filter": {
             "input": {
              "$map": {
                  "input": "$performanceData",
                  "as": "el",
                  "in": "$$el.macd"
              }},
             "as": "num",
             "cond": {"$ne":["$$num" , null]}
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
          "priceSeries": {
            "$filter": {
             "input": {
              "$map": {
                  "input": "$performanceData",
                  "as": "el",
                  "in": "$$el.price"
              }},
             "as": "num",
             "cond": {"$ne":["$$num" , null]}
          }},
          "volumeSeries": {
            "$filter": {
             "input": {
              "$map": {
                  "input": "$performanceData",
                  "as": "el",
                  "in": "$$el.volume"
              }},
             "as": "num",
             "cond": {"$ne":["$$num" , null]}
          }},
      }},
      { "$addFields":{
          "enoughSlowData": {"$switch": {
            "branches":[{
              "case":{"$gt":[{"$size": "$priceSeries"} , slowSMA]}, "then": true}
                ],
            "default":false
          }},
          "enoughFastData": {"$switch": {
            "branches":[{
              "case":{"$gt":[{"$size": "$priceSeries"} , fastSMA]}, "then": true}
                ],
            "default":false
          }},
          "enoughMACD": {"$switch": {
            "branches":[{
              "case":{"$gte":[{"$size": "$macdSeries"} , lookback]}, "then": true}
                ],
            "default":false
          }},
          "enoughADX": {"$switch": {
            "branches":[{
              "case":{"$gte":[{"$size": "$adxSeries"} , 0]}, "then": true}
                ],
            "default":false
          }},
          "enoughVolume": {"$switch": {
            "branches":[{
              "case":{"$gte":[{"$size": "$volumeSeries"} , 10]}, "then": true}
                ],
            "default":false
          }},
          }},
      {
        "$addFields":
        {
        "fastSMA":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughFastData",true]},"then":{"$round":[{"$avg":{"$slice": [ "$priceSeries", parseFloat(fastSMA) ]}}, 2]},}
                      ],
                  "default":null
                    }},
        "fastSMALookback":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughFastData",true]},"then":{"$avg":{"$slice": [ "$priceSeries", lookback, fastSMA ]}},}
                      ],
                  "default":null
                    }},
        "slowSMA":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughSlowData",true]},"then":{"$round":[{"$avg":{"$slice": [ "$priceSeries", slowSMA ]}}, 2]}}
                      ],
                  "default":null
                    }},
        "slowSMALookback":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughSlowData",true]},"then":{"$round":[{"$avg":{"$slice": [ "$priceSeries", lookback, slowSMA ]}}, 2]},}
                      ],
                  "default":null
                    }},
        "macd":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughMACD",true]},"then":{"$round":[{"$arrayElemAt": [ "$macdSeries", 0 ] }, 2]}
                    }],
                  "default":null
                    }},
        "macdLookback":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughMACD",true]},"then":{"$round":[{"$arrayElemAt": [ "$macdSeries", lookback] }, 2]}
                    }],
                  "default":null
                    }},
        "adx":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughADX",true]},"then":{"$round":[{"$arrayElemAt": [ "$adxSeries", 0 ] }, 2]}
                    }],
                  "default":null
                    }},
        "volumeCurr": {"$avg":{"$slice": [ "$volumeSeries", 1]}},
        "volumeAvg":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughVolume",true]},"then":{"$avg":{"$slice": [ "$volumeSeries", 10]}}
                    }],
                  "default":null
                    }},
        "volumeLookbackAvg":{
            "$switch":{
                "branches":[{
                    "case":{"$eq":["$enoughVolume",true]},"then":{"$avg":{"$slice": [ "$volumeSeries", lookback, 10]}}
                    }],
                  "default":null
                    }},
          "priceCurr": {"$round":[{"$avg":{"$slice": [ "$priceSeries", 1]}}, 2]},
          },
      },
      {
        "$addFields":
        {
        "fastOverSlow":{
            "$switch":{
                "branches":[{
                    "case":
                        { "$and": [ 
                            {"$gt":["$fastSMA","$slowSMA"]}, 
                            {"$eq":["$enoughSlowData", true]},
                            {"$eq":["$enoughFastData", true]},
                            ]}
                    ,"then":1}
                      ],
                  "default":0
                    }},
        "fastPosSlope":{
            "$switch":{
                "branches":[{
                    "case":
                        { "$and": [ 
                            {"$gt":["$fastSMA","$fastSMALookback"]}, 
                            {"$eq":["$enoughFastData", true]},
                            ]}
                    ,"then":1}
                      ],
                  "default":0
                    }},
        "slowPosSlope":{
            "$switch":{
                "branches":[{
                    "case":
                        { "$and": [ 
                            {"$gt":["$slowSMA","$slowSMALookback"]}, 
                            {"$eq":["$enoughFastData", true]},
                            ]}
                    ,"then":1}
                      ],
                  "default":0
                    }},
        "macdPosSlope":{
            "$switch":{
                "branches":[{
                    "case":
                        { "$and": [ 
                            {"$gt":["$macd","$macdLookback"]},
                            {"$eq":["$enoughMACD", true]},
                            ]}
                    ,"then":1}
                      ],
                  "default":0
                    }},
        "adxTrue":{
            "$switch":{
                "branches":[{
                    "case":
                        { "$and": [ 
                            {"$gt":["$slowSMA","$slowSMALookback"]},
                            {"$eq":["$enoughADX", true]},
                            {"$eq":["$enoughSlowData", true]}
                            ]}
                    ,"then":{ "$divide": ["$adx", 100] }}
                      ],
                  "default":0
                    }},
            },
      },
      {"$project":{
        "_id":1,
        "name":1,
        "daysSinceIPO": {
            "$divide": [{ "$subtract": [new Date(), '$ipoDate'] }, 1000 * 60 * 60 * 24]
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
        "assetType":1,
        "ipoDate":1,
        "exchange":1,
        "adxTrue": 1,
        "trendEdge" :
          {"$round" :[{ "$sum": [ { "$multiply": [ "$fastOverSlow", fastOverSlowWeight] }, { "$multiply": [ "$fastPosSlope", fastWeight] }, { "$multiply": ["$slowPosSlope", slowWeight] },
          { "$multiply": [ "$macdPosSlope", macdWeight] }, { "$multiply": [ "$adxTrue", adxWeight] } ]
          }, 3]},
    }},
  {"$sort":{"trendEdge":-1}}, 
])