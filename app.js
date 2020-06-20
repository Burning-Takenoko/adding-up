'use strict';
//fs は、FileSystem（ファイルシステム）の略で、ファイルを扱うためのモジュールです。
const fs = require('fs');

//readline は、ファイルを一行ずつ読み込むためのモジュールです。
const readline = require('readline');

//popu-pref.csv ファイルから、ファイルを読み込みを行う Stream（ストリーム） rsオブジェクトを生成
const rs = fs.createReadStream('./popu-pref.csv');

//rsをreadline オブジェクトの input として設定し rl オブジェクトを作成
//The readline.createInterface() method creates a new readline.Interface instance.
const rl = readline.createInterface({ input: rs, output: {} });

const prefectureDataMap =new Map();// key:都道府県 value:集計データのオブジェクト

//onメソッドは、様々な関数にイベント登録を行うことが出来るもの。第一引数で指定したイベント発生後、第二引数の関数を実行する
//rl オブジェクトで line (改行) というイベントが発生したら無名関数を呼び出し
//line イベントが発生したタイミングで、コンソールに引数 lineString の内容が出力される
//lineString には、読み込んだ 1 行の文字列が入っている
//rl オブジェクトの働きは??? → rsオブジェクトから文字列を受け取る
rl.on('line',lineString =>{
//    console.log(lineString);
    const columns= lineString.split(',');
    const year= parseInt(columns[0]);
    const prefecture= columns[1];
    const popu =parseInt(columns[3]);

    if (year === 2010 || year === 2015){
        
        let value= prefectureDataMap.get(prefecture);
        
        //valueがfalsyの時に初期値を代入
        if (!value) {
            value={
            popu10: 0,
            popu15: 0,
            change: null
            };
        }
        if (year === 2010){
            value.popu10=popu;
        }
        if (year === 2015){
            value.popu15=popu;           
        }
        //人口のデータを連想配列に保存
        prefectureDataMap.set(prefecture,value);
    }
});

rl.on('close',() =>{
    for (let [key,value] of prefectureDataMap){
        value.change=value.popu15/value.popu10;
    }
    const rankingArray=Array.from(prefectureDataMap).sort((pair1,pair2)=>{
            return pair2[1].change-pair1[1].change;
    });
    const rankingStrings=rankingArray.map(([key,value]) =>{
        return (
            key + ':' + value.popu10 + '=>' + value.popu15 + ' 変化率:' + value.change
        );
    });
    console.log(rankingStrings);
});