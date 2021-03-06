package common

import (
	"math"
	"time"

	"github.com/qiniu/db/mgoutil.v3"
	"gopkg.in/mgo.v2/bson"
)

type M map[string]interface{}

type CaiConf struct {
	Name    string `json:"name"`
	Type    string `json:"type"`
	Cron    string `json:"cron"`
	Urls    string `json:"urls"`
	Disable bool   `json:"disable"`
}

type Job interface {
	Run()
	Fetch() (Lottery, error)
	Store(Lottery) error
	Cron() string
	Name() string
	Type() string
}

type Bet struct {
	Id        bson.ObjectId  `json:"id" bson:"_id"`
	From      int            `json"from" bson:"from"`      //类型 1：用户 2：管理员 3：机器人
	UserId    string         `json:"userid" bson:"userid"` //用户ID
	No        int64          `json:"no" bson:"no"`         //期号
	Nickname  string         `json:"nickname" bson:"nickname"`
	Game      string         `json:"game" bson:"game"`     //游戏类型
	Method    int            `json:"method" bson:"method"` //游戏的玩法编号
	Choice    map[string]int `json:"choice" bson:"choice"`
	Amount    float64        `json:"amount" bson:"amount"`
	Avatar    string         `json:"avatar" bson:"avatar"`
	Dealed    bool           `json:"dealed" bson:"dealed"`
	CreatedAt bool           `json:"createdAt" bson:"createdAt"`
}

type Lottery struct {
	No            int64  `json:"no" bson:"no"`
	Expect        string `json:"expect"`
	Opencode      string `json:"opencode" bson:"code"`
	Opentime      string `json:"opentime" bson:"opentime"`
	Opentimestamp int64  `json:"opentimestamp"`
}

type LotteryItem struct {
	No       int64  `json:"no" bson:"no"`
	Number   string `json:"number" bson:"number"`
	Dateline string `json:"dateline" bson:"dateline"`
}

type Lotterys struct {
	Rows int       `json:"rows"`
	Code string    `json:"code"`
	Data []Lottery `json:"data"`
}
type Collections struct {
	SettingsColl    mgoutil.Collection `coll:"settings"`
	UserColl        mgoutil.Collection `coll:"users"`
	LotteryColl     mgoutil.Collection `coll:"lotterys"`
	BetColl         mgoutil.Collection `coll:"bets"`
	QuizColl        mgoutil.Collection `coll:"quizs"`
	TerraceStatColl mgoutil.Collection `coll:"terrace_stats"`
	UserStatColl    mgoutil.Collection `coll:"users_stats"`
	ChangLongColl   mgoutil.Collection `coll:"changlongs"`
}

var timeLayout = "2006-01-02 15:04:05"

func GetCurrTime() string {
	return time.Now().Format(timeLayout)
}

func ParseTimeString(timeStr string) (time.Time, error) {
	return time.Parse("2006-01-02 15:04:05", timeStr)
}

func GetCurrDay() string {
	return time.Now().Format("2006-01-02")
}

func Round(f float64, n int) float64 {
	pow10_n := math.Pow10(n)
	return math.Trunc((f+0.5/pow10_n)*pow10_n) / pow10_n
}
