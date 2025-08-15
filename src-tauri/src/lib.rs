use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: Option<i64>,
    pub url: String,
    pub title: String,
    pub brand: String,
    pub r#type: String,
    pub price: f64,
    pub specification: Option<String>,
    pub date: String,
    pub remark: Option<String>,
    pub created_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ProductInput {
    pub url: String,
    pub title: String,
    pub brand: String,
    pub r#type: String,
    pub price: f64,
    pub specification: Option<String>,
    pub date: String,
    pub remark: Option<String>,
}

pub struct DatabaseState {
    pub conn: Mutex<Connection>,
}

impl DatabaseState {
    pub fn new() -> Result<Self> {
        let conn = Connection::open("products.db")?;
        
        // Create table if it doesn't exist
        conn.execute(
            "CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                url TEXT NOT NULL,
                title TEXT NOT NULL,
                brand TEXT NOT NULL,
                type TEXT NOT NULL,
                price REAL NOT NULL,
                specification TEXT,
                date TEXT NOT NULL,
                remark TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        )?;

        Ok(DatabaseState {
            conn: Mutex::new(conn),
        })
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn save_product(
    product: ProductInput,
    state: State<'_, DatabaseState>,
) -> Result<Product, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare(
            "INSERT INTO products (url, title, brand, type, price, specification, date, remark) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)"
        )
        .map_err(|e| e.to_string())?;

    let id = stmt
        .insert((
            &product.url,
            &product.title,
            &product.brand,
            &product.r#type,
            product.price,
            &product.specification,
            &product.date,
            &product.remark,
        ))
        .map_err(|e| e.to_string())?;

    // Get the created product
    let mut stmt = conn
        .prepare("SELECT id, url, title, brand, type, price, specification, date, remark, created_at FROM products WHERE id = ?1")
        .map_err(|e| e.to_string())?;

    let product_row = stmt
        .query_row([id], |row| {
            Ok(Product {
                id: Some(row.get(0)?),
                url: row.get(1)?,
                title: row.get(2)?,
                brand: row.get(3)?,
                r#type: row.get(4)?,
                price: row.get(5)?,
                specification: row.get(6)?,
                date: row.get(7)?,
                remark: row.get(8)?,
                created_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    Ok(product_row)
}

#[tauri::command]
async fn get_products(state: State<'_, DatabaseState>) -> Result<Vec<Product>, String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    let mut stmt = conn
        .prepare("SELECT id, url, title, brand, type, price, specification, date, remark, created_at FROM products ORDER BY created_at DESC")
        .map_err(|e| e.to_string())?;

    let product_iter = stmt
        .query_map([], |row| {
            Ok(Product {
                id: Some(row.get(0)?),
                url: row.get(1)?,
                title: row.get(2)?,
                brand: row.get(3)?,
                r#type: row.get(4)?,
                price: row.get(5)?,
                specification: row.get(6)?,
                date: row.get(7)?,
                remark: row.get(8)?,
                created_at: row.get(9)?,
            })
        })
        .map_err(|e| e.to_string())?;

    let mut products = Vec::new();
    for product in product_iter {
        products.push(product.map_err(|e| e.to_string())?);
    }

    Ok(products)
}

#[tauri::command]
async fn delete_product(id: i64, state: State<'_, DatabaseState>) -> Result<(), String> {
    let conn = state.conn.lock().map_err(|e| e.to_string())?;
    
    conn.execute("DELETE FROM products WHERE id = ?1", [id])
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let db_state = DatabaseState::new().expect("Failed to initialize database");
    
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![
            greet,
            save_product,
            get_products,
            delete_product
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
