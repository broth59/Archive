


function foramt1(values){
    const column_list = `TABLE_NAME	COLUMN_NAME	COL_DESC_KOR	COL_DESC_ENG	COL_DESC_OTH	ENCRYPT_YN`.split('\t').map(column=>column.trim())
    const value_list  = values.split('\t').map(column=>`'${column.trim()}'`)

    return `
        INSERT INTO TB_ZZ_ENCR_COLUMNS (
            ${column_list.join()}
        ) VALUES (
            ${value_list.join()}
        );
    `
}

function foramt2(values){
    const column_list = `TABLE_NAME	COLUMN_NAME	MASKING_YN	USE_YN	FIRST_REG_DT	FIRST_REG_USER_ID	FIRST_REG_USER_IP	LAST_UPD_DT	LAST_UPD_USER_ID	LAST_UPD_USER_IP	MASKING_TYPE_CODE
    `.split('\t').map(column=>column.trim())
    const value_list  = values.split('\t').map(column=>!column.startsWith('SYSTIME') ? `'${column.trim()}'` : column)
    return `
        INSERT INTO TB_ZZ_ENCR_COLUMNS_MASK (
            ${column_list.join()}
        ) VALUES (
            ${value_list.join()}
        );
    `
}

console.log(foramt1(`TB_FD_REGIST	CVC_NO	카드번호	CvcNo	CvcNo	Y`))
console.log(foramt1(`TB_FD_REGIST	VAL_PERIOD	유효기간	ValPeriod	ValPeriod	Y`))
console.log(foramt1(`TB_IR_RSVN_MST	VAL_PERIOD	유효기간	ValPeriod	ValPeriod	Y`))
console.log(foramt1(`TB_IR_RSVN_MST	CVC_NO	카드번호	CvcNo	CvcNo	Y`))

console.log(foramt2(`TB_FD_REGIST	CVC_NO	Y	Y	SYSTIMESTAMP\tadmin 	192.168.7.145	SYSTIMESTAMP\tadmin	192.168.7.145	`))
console.log(foramt2(`TB_FD_REGIST	VAL_PERIOD	Y	Y	SYSTIMESTAMP\tadmin	192.168.7.145	SYSTIMESTAMP\tadmin	192.168.7.145`))
console.log(foramt2(`TB_IR_RSVN_MST	VAL_PERIOD	Y	Y	SYSTIMESTAMP\tadmin	192.168.7.145	SYSTIMESTAMP\tadmin	192.168.7.145	`))
console.log(foramt2(`TB_IR_RSVN_MST	CVC_NO	Y	Y	SYSTIMESTAMP\tadmin	192.168.7.145	SYSTIMESTAMP\tadmin	192.168.7.145	`))

