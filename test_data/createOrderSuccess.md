# Create cart

Request

```graphql
mutation {
  orderCreate(
    input: {order: { firstName: "Jack", surname: "Sprat", phone: "123456789" } }
  ) {
    status
    errors {
      field
    }
    order {
      id
      invoices {
        edges {
          node {
            id
            legacyId
            lineItems {
              id
              quantity
            }
          }
        }
      }
    }
  }
}
```

Response

```json
{
    "status": 200,
    "errors": null,
    "order": {
    "id": "T3JkZXItMTAyODM=",
    "invoices": {
        "edges": [
            {
                "node": {
                "id": "SW52b2ljZS0xMDI5NA==",
                "legacyId": 10294,
                "lineItems": [
                    { "id": "TGluZUl0ZW0tMzA1", "quantity": 1 }
                    ]
                }
            }
        ]
    }
    }
}
```
