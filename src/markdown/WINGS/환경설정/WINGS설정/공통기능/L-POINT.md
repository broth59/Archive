# L-POINT 


## 사용 테이블

+ TB_FO_POS

| 테이블 | 컬럼 | 제약조건 |
|---|:---:|---:|
| TB_FO_POS | BSNS_CODE | PK |
| TB_FO_POS | SALE_DATE | PK |
| TB_FO_POS | LOC_CODE | PK |
| TB_FO_POS | POS_NO | PK |
| TB_FO_POS | BILL_NO | PK |
| TB_FO_POS | BILL_SEQ_NO | PK |


+ TB_IA_CARD_APPR_HIST


| 테이블 | 컬럼 | 명칭 |
|---|:---:|---:|
| TB_IA_CARD_APPR_HIST | AVL_PNT | 가용 포인트 |
| TB_IA_CARD_APPR_HIST | BALANCE_PNT | 잔여 POINT |


+ 사용 현황
    ```SQL
    SELECT *  
    FROM  TB_IA_CARD_APPR_HIST  
    WHERE 1=1  
     AND SPC_TYPE_CODE IN ('12','13')
     AND VAN_CODE = '05'
    ``` 

## 조회

```SQL
SELECT 
    POS.SUM_AMT, 
    APPR.AVL_PNT, 
    APPR.BALANCE_PNT
FROM TB_FO_POS POS 
INNER JOIN TB_IA_CARD_APPR_HIST APPR
ON POS.BSNS_CODE = APPR.BSNS_CODE
AND POS.SALE_DATE = APPR.SALE_DATE
AND POS.LOC_CODE = APPR.LOC_CODE
AND POS.BILL_NO = APPR.BILL_NO
AND POS.BILL_SEQ_NO = APPR.BILL_SEQ_NO


```