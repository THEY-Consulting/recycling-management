# Login Credentials for Testing

## Management User (Full Access)
- **Email**: admin@they.com
- **Password**: admin123
- **Access**: Can view both customer and management interfaces

## Customer Users (Customer Access Only)

### Customer 1
- **Email**: john@example.com
- **Password**: password123
- **Name**: John Doe
- **License Plate**: ABC-123
- **Phone**: +49 123 456789

### Customer 2
- **Email**: jane@example.com
- **Password**: password123
- **Name**: Jane Smith
- **License Plate**: XYZ-789
- **Phone**: +49 987 654321

## Creating New Users

You can create new customer accounts through the registration form on the login page. All newly created users will have customer role by default.

## Features by Role

### Customer Users Can:
- Book appointments
- View their appointments with route visualization
- Edit their profile (name, email, license plate, phone)
- Cancel pending/confirmed appointments

### Management Users Can:
- Everything customers can do, PLUS:
- View management dashboard with statistics
- Schedule container maintenance
- Switch between customer and management views
- See all facility operations and waste levels

## Notes

- All data is stored in-memory and will reset when the page is refreshed
- Passwords are stored in plain text (for prototype only - never do this in production!)
- User sessions are stored in localStorage

