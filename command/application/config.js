/**
.-----------------------------------------------------------------------------.
||Es| |F1 |F2 |F3 |F4 |F5 | |F6 |F7 |F8 |F9 |F10|                  KINGMAN    |
||__| |___|___|___|___|___| |___|___|___|___|___|              +962792914245  |
| _____________________________________________     ________    ___________   |
||~  |! |" |§ |$ |% |& |/ |( |) |= |? |` || |<-|   |Del|Help|  |{ |} |/ |* |  |
||`__|1_|2_|3_|4_|5_|6_|7_|8_|9_|0_|ß_|´_|\_|__|   |___|____|  |[ |]_|__|__|  |
||<-  |Q |W |E |R |T |Z |U |I |O |P |Ü |* |   ||               |7 |8 |9 |- |  |
||->__|__|__|__|__|__|__|__|__|__|__|__|+_|_  ||               |__|__|__|__|  |
||Ctr|oC|A |S |D |F |G |H |J |K |L |Ö |Ä |^ |<'|               |4 |5 |6 |+ |  |
||___|_L|__|__|__|__|__|__|__|__|__|__|__|#_|__|       __      |__|__|__|__|  |
||^    |> |Y |X |C |V |B |N |M |; |: |_ |^     |      |A |     |1 |2 |3 |E |  |
||_____|<_|__|__|__|__|__|__|__|,_|._|-_|______|    __||_|__   |__|__|__|n |  |
|   |Alt|A  |                       |A  |Alt|      |<-|| |->|  |0    |. |t |  |
|   |___|___|_______________________|___|___|      |__|V_|__|  |_____|__|e_|  |
|                    https://github.com/KMKINGMAN                           |
`-----------------------------------------------------------------------------'
 */
const si = require("../../me-modlas/application-system/guildsetup")
const { MessageEmbed } = require("discord.js");
const kingman = require('../../me-handler/kingman/msg')
 module.exports = {
   name: "config",
   category: "application",
   description: "This command is used to control bot settings",
   run: async (client, kmsg, args, PREFIX) => {
     const me = new kingman.ME(kmsg)
     if(!kmsg.member.hasPermission('MANAGE_ROLES')){
       return me.ERR(`You need \`MANAGE_ROLES\`permissions to do this action`)
     }
     let ops = [
       "SetChannel",
       "AddQuestions",
       "RemoveQuestions",
       "ShowQuestions",
       "GeneralShow",
       "SetRole"
     ]
      if(!args[0]){
        return me.SEND(`Options Menu`, `${PREFIX}${module.exports.name} ${ops.join(`\n ${PREFIX}${module.exports.name} `)}`)
      }
      function check(msg, arr) {
			return arr.some(op => op.toLowerCase() === msg.toLowerCase());
		}
      if (check(args[0],ops) === false) {
        return kmsg.channel.send(ops)
      } 
      switch(args[0].toLowerCase()) {
        case ops[0].toLocaleLowerCase():
        let ch = await me.GetChannel(args[1])
        if(!ch) {
          return await me.ERR(`You must select Chanel\n Usage:\`${PREFIX}${module.exports.name} ${ops[0].toLocaleLowerCase()} <CHANNEL>\``)
        }
        let channeldata = await si.findOneAndUpdate({
          GuildID:kmsg.guild.id
        },{
          $set:{
            ChannelID:ch.id
          }
        })
        if(!channeldata){
          channeldata = await si.create({
            GuildID:kmsg.guild.id,
            ChannelID: ch.id
          })
        }
        channeldata.save().then(s=> {
          kmsg.react('✅')
        }).catch(()=>{
          kmsg.react('❌')
        })
        await me.SEND(`Channel selected Successfully`, `Apply Cahnnel Now in [<#${ch.id}>]`)
        break;
        case ops[1].toLocaleLowerCase(): 
        let qustion = kmsg.content.split(' ').slice(2).join(" ")
        let addq = await si.findOneAndUpdate({
          GuildID:kmsg.guild.id
        }, {
          $push :{
            Quzz : qustion
          }
        }
        )
        if(!addq){
          addq = await si.create({
            GuildID:kmsg.guild.id,
            Quzz : qustion
          })
        }
        addq.save().then(s=> {
          kmsg.react('✅')
        }).catch(()=>{
          kmsg.react('❌')
        })
        await me.SEND(`Question has been added`,`\`${qustion}\``)
        break;
        case ops[2].toLocaleLowerCase(): 
        let qustion2 = kmsg.content.split(' ').slice(2).join(" ")
        let srddq = await si.findOne({
          GuildID:kmsg.guild.id
        })
        if(!srddq){
          srddq = await si.create({
            GuildID:kmsg.guild.id
          })
        }
        srddq.save();
        if(!srddq.Quzz.includes(qustion2)){
          return await me.ERR(`The question was not found`)
        }      
        let rddq = await si.findOneAndUpdate({
          GuildID:kmsg.guild.id
        }, {
          $pull :{
            Quzz : qustion2
          }
        })
        rddq.save().then(s=> {
          kmsg.react('✅')
        }).catch(()=>{
          kmsg.react('❌')
        })
        await me.SEND(`Question removed`, `\`${qustion2}\``)        
        break;
        case ops[3].toLocaleLowerCase(): 
        let adata = await si.findOne({GuildID:kmsg.guild.id})
        if(!adata.Quzz[0]) {
          return me.ERR(`No data found from`)
        }
        if(!adata){
          return await me.ERR(`No data found`)
        }
        kmsg.channel.send(`**・ ${adata.Quzz.join(`\n・ `)}**`)
        break;
        case ops[4].toLocaleLowerCase():
        let alldata = await si.findOne({GuildID:kmsg.guild.id})
        if(!alldata){
          alldata = await si.create({GuildID:kmsg.guild.id})
          alldata.save()
        }
        let ach = alldata.ChannelID;
        let Role = alldata.Role
        let aquz = alldata.Quzz.length;
        await me.SEND(`Setup information`, `Channel : <#${ach}>\nNumber of questions : ${aquz}\n Role: <@&${Role}>`)
        break;
        case ops[5].toLocaleLowerCase():
        let role = await me.GetRoles(args[1]);
        if(!role){
          return me.ERR(`You must select Role\n Usage:\`${PREFIX}${module.exports.name} ${ops[5].toLocaleLowerCase()} <Role>\``)
        }
        let rodata = await si.findOneAndUpdate({GuildID:kmsg.guild.id}, {
          $set :{
            Role : role.id
          }
        })
        if(!rodata){
          rodata = await si.create({
            GuildID:kmsg.guild.id,
            Role : role.id
          })
        }
        rodata.save().then(s=> {
          kmsg.react('✅')
        }).catch(()=>{
          kmsg.react('❌')
        })
        await me.SEND(`Role selected Successfully`,`Role:\n[<@&${role.id}>]`)
        break;
        
      }
    }
 }
