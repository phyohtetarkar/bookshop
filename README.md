# Bookshop

## Environmental variable file

For admin (.env.local)
```env
REACT_APP_FIREBASE_API_KEY=<api-key>

REACT_APP_FIREBASE_STORAGE_PATH=https://firebasestorage.googleapis.com/v0/b/<your-bucket-id>/o
```

For consumer (.env.local)
```env
NEXT_PUBLIC_APP_NAME=Shop Name

NEXT_PUBLIC_FIREBASE_API_KEY=<api-key>

NEXT_PUBLIC_FIREBASE_STORAGE_PATH=https://firebasestorage.googleapis.com/v0/b/<your-bucket-id>/o

NEXT_PUBLIC_FACEBOOK_PAGE_ID=<facebook-page-id>
```
## Data model
```json
{
    "banner": [
        "homeBanner": {
            "images": "<string-array>",
        },
    ],

    "category": {
        "id": "<string>",
        "name": "<string>",
        "createdAt": "<long>",
        "createdBy": "<string>",
        "updatedAt": "<long>",
        "updatedBy": "<string>"
    },

    "author": {
        "id": "<string>",
        "name": "<string>",
        "createdAt": "<long>",
        "createdBy": "<string>",
        "updatedAt": "<long>",
        "updatedBy": "<string>"
    },

    "book": {
        "id": "<string>",
        "name": "<string>",
        "nameLowercase": "<string>",
        "price": "<number>",
        "discount": {
            "value": "<number",
            "type": "percent | fixed"
        },
        "isDiscount": "<boolean>",
        "newArrival": "<boolean>",
        "popular": "<boolean>",
        "available": "<boolean>",
        "code": "<string>",
        "publishedYear": "<number>",
        "numberOfPages": "<number>",
        "publisher": "<string>",
        "edition": "<string>",
        "images": "<string-array>",
        "hidden": "<boolean>",
        "description": "<html-string>",
        "category": "<categoryId>",
        "author": "<authorId>",
        "createdAt": "<long>",
        "createdBy": "<string>",
        "updatedAt": "<long>",
        "updatedBy": "<string>"
    },

    "order": {
        "id": "<string>",
        "orderNumber": "<string>",
        "customer": "<string>",
        "phoneNumber": "<string>",
        "address": "<string>",
        "totalProduct": "<number>",
        "subtotal": "<number>",
        "totalPrice": "<number>",
        "discount": "<number>",
        "deliveryFee": "<number>",
        "status": "<string>",
        "items": [
            {
                "quantity": "<number>",
                "unitPrice": "<number>",
                "discount": "<number>",
                "price": "<number>",
                "productId": "<string>",
                "product:": "<embedded>"
            }
        ],
        "createdAt": "<long>",
        "updatedAt": "<long>",
        "updatedBy": "<string>"
    },

    "notification": {
        "id": "<string>",
        "title": "<string>",
        "description": "<string>",
        "createdAt": "<long>",
        "createdBy": "<string>"
    },

    "setting": {
        "generalSetting": {
            "aboutUs": "<string>",
            "termsAndConditions": "<string>",
            "appStoreUrl": "<string>",
            "playStoreUrl": "<string>",
            "contact": {
                "phoneNumbers": "<array>",
                "email": "<string>",
                "address": "<string>",
                "location": {
                    "lat": "<double>",
                    "lon": "<double>"
                }
            },
            "socialMedias": {
                "facebook": "<string>",
                "twitter": "<string>",
                "instagram": "<string>"
            },
            "updatedAt": "<long>",
            "updatedBy": "<string>"
        },
        "productSetting": {
            "publishers": "<array>",
            "editions": "<array>",
            "updatedAt": "<long>",
            "updatedBy": "<string>"
        },
        "orderSetting": {
            "minimumOrderLimitPerProduct": "<number>",
            "payments": [
                {
                    "method": "<string>",
                    "number": "<string>"
                }
            ],
            "updatedAt": "<long>",
            "updatedBy": "<string>"
        }
    }
}
```

## Firebase setup

### Authentication

This project use firebase auth for admin login with email and password. This project manually need to create admin users in firebase auth. After you created users, you need admin users' **uid** for security rule setup up to restrict your resources (firestore and storage) access.

1. Setup firebase auth
2. Add admin users manually with email and password
3. Add a collection naming **users** in firestore
4. Add document to **users** collection with **id** and field **admin** for each auth users
   - **id** (uid from firebase auth)
   - **admin** (boolean type with value *true*)

### Firestore

Collections as shown in **data model**

- banners
- authors
- categories
- books
- orders
- users
- settings

> [!NOTE]
> You will also need to create firestore composite indexes for **books** and **orders** for data query filtering.

```bash
# Security rule
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.admin == true;
    }

    match /orders/{document=**} {
    	allow create: if true;
    }
    
    match /{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

### Storage

This project need to create **banners** and **books** folders for storing images.


```bash
# Security rule
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function canAccess() {
      return request.auth.uid in ['your-admin-uids'];
    }
    
    match /{allPaths=**} {
      allow read: if true;
      allow write: if canAccess(); 
    }
  }
}
```

## Screenshots

<img src="home.png">

