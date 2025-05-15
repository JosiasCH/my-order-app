from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import mysql.connector
from decimal import Decimal
from datetime import date


app = FastAPI(
    title="My Orders API",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


db_config = {
    "host": "mysql.railway.internal",
    "user": "root",
    "password": "HmmHfPjJgmAqiOrAzWeNoKhpLAZHeCF",
    "database": "railway",
    "port": 3306
}


class Order(BaseModel):
    id: Optional[int] = None
    orderNumber: str
    orderDate: str
    finalPrice: float
    status: str

@app.get("/api/orders", response_model=List[Order])
def get_orders():
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM orders")
        rows = cursor.fetchall()
        return [
            {
                "id": row["id"],
                "orderNumber": row["order_number"],
                "orderDate": str(row["order_date"]) if isinstance(row["order_date"], date) else row["order_date"],
                "finalPrice": float(row["final_price"]) if isinstance(row["final_price"], Decimal) else row["final_price"],
                "status": row["status"]
            }
            for row in rows
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.post("/api/orders", response_model=Order)
def create_order(order: Order = Body(...)):
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO orders (order_number, order_date, final_price, status) VALUES (%s, %s, %s, %s)",
            (order.orderNumber, order.orderDate, order.finalPrice, order.status)
        )
        conn.commit()
        return {**order.dict(), "id": cursor.lastrowid}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.put("/api/orders/{order_id}", response_model=dict)
def update_order(order_id: int, order: Order = Body(...)):
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute(
            "UPDATE orders SET order_number=%s, order_date=%s, final_price=%s, status=%s WHERE id=%s",
            (order.orderNumber, order.orderDate, order.finalPrice, order.status, order_id)
        )
        conn.commit()
        return {"message": "Order updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.delete("/api/orders/{order_id}", response_model=dict)
def delete_order(order_id: int):
    conn = None
    cursor = None
    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        cursor.execute("DELETE FROM orders WHERE id = %s", (order_id,))
        conn.commit()
        return {"message": "Order deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
