import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
export function localPreferences(filename=':memory:'){
 const db=new DatabaseSync(filename);
 db.exec(fs.readFileSync(new URL('../migrations/0001_preferences.sql',import.meta.url),'utf8'));
 const prepare=sql=>({values:[],bind(...values){return {...this,values};},run(){const result=db.prepare(sql).run(...this.values);return {success:true,meta:{changes:result.changes}};},all(){return {results:db.prepare(sql).all(...this.values),success:true};}});
 return {prepare,async batch(statements){return statements.map(s=>s.all());},close(){db.close();},exec:sql=>db.exec(sql)};
}
