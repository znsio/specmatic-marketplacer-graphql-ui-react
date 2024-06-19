# Create cart

Request

```graphql
mutation {
  orderCreate(
    input: {order: {firstName: "George", surname: "Spire", phone: "987654321"}}
  ) {
    status
    errors {
      field
      messages
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
  "errors": [
    {
      "field": "external_ids",
      "messages": ["order with same external id already exists"]
    }
  ],
  "order": null
}
```
