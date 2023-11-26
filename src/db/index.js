export * from './user.db';
import DB from '../../database/sqlDB.connect';
DB.sync({
    force:false,// Drops the table and create a new one with updated fields
    alter:false// Updates the existing table
})