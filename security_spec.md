# Security Specification - Luxe Loom Clothing

## Data Invariants
1. A **Product** can only be created, updated, or deleted by an **Admin**.
2. **Products** are publicly readable.
3. A **User** profile can only be read/updated by the user themselves (or an Admin).
4. **Orders** can only be created by authenticated users.
5. a **User** can only read their own **Orders**.
6. **Admins** can read and update all **Orders** (to change status).
7. **Identity Integrity**: `userId` or `ownerId` in any document must match `request.auth.uid`.

## The "Dirty Dozen" Payloads (Anti-Integrity Tests)
1. **Unauthenticated Product Creation**: Attempting to create a product without a login.
2. **Customer Deleting Product**: A non-admin user trying to delete a product.
3. **Shadow Field Injection**: Adding an `isAdmin: true` field to a user profile update.
4. **ID Poisoning**: Using a 1MB string as a `productId`.
5. **Orphaned Order**: Creating an order for a non-existent `userId`.
6. **Price Tampering**: Updating a product price to a negative value.
7. **Cross-User Data Leak**: User A trying to read User B's orders.
8. **Admin Claim Spoofing**: Attempting to set `role: 'admin'` upon self-registration.
9. **Terminal State Bypass**: Changing an order status from 'delivered' back to 'pending'.
10. **Timestamp Fraud**: Providing a client-side `createdAt` in the future.
11. **Massive Payload**: Sending a 2MB string in the product description.
12. **Unverified Order**: Creating an order with an unverified email.

## Next Steps
- Implement `firestore.rules` based on these invariants.
- Deploy rules.
