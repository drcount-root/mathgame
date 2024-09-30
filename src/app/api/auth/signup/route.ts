import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import fs from "fs/promises";
// import path from "path";
import connectMongo from "@/lib/mongodb";
import { User } from "@/models/User";

// // Path to db.json
// const dbPath = path.join(process.cwd(), "src/db/db.json");

// // Helper function to read the database
// async function readDB() {
//   const data = await fs.readFile(dbPath, "utf-8");
//   return JSON.parse(data);
// }

// // Helper function to write to the database
// async function writeDB(newData: any) {
//   await fs.writeFile(dbPath, JSON.stringify(newData, null, 2), "utf-8");
// }

// Signup route
export async function POST(req: Request) {
  try {
    const { name, email, password, country, age } = await req.json();
    // const db = await readDB();
    await connectMongo();

    // Log the incoming data for debugging
    console.log("Incoming signup data:", { name, email, country, age });

    // // Check if user already exists
    // const existingUser = db.users.find((user: any) => user.email === email);
    // if (existingUser) {
    //   return NextResponse.json(
    //     { error: "User already exists" },
    //     { status: 400 }
    //   );
    // }

     // Check if user already exists
     const existingUser = await User.findOne({ email });
     if (existingUser) {
       return NextResponse.json(
         { error: "User already exists" },
         { status: 400 }
       );
     }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = {
    //   id: Date.now().toString(),
    //   name,
    //   email,
    //   password: hashedPassword,
    //   country,
    //   age,
    // };

     // Create a new user
     const newUser = new User({
      name,
      email,
      password: hashedPassword,
      country,
      age,
    });

    // // Add new user to db.json
    // db.users.push(newUser);
    // await writeDB(db);

    // Save the new user to MongoDB
    await newUser.save();

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error during signup:", error); // Log the error
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import fs from "fs/promises";
// import path from "path";

// // Path to db.json
// const dbPath = path.join(process.cwd(), "../../../../db/db.json");

// // Helper function to read the database
// async function readDB() {
//   const data = await fs.readFile(dbPath, "utf-8");
//   return JSON.parse(data);
// }

// // Helper function to write to the database
// async function writeDB(newData: any) {
//   await fs.writeFile(dbPath, JSON.stringify(newData, null, 2), "utf-8");
// }

// // Signup route
// export async function POST(req: Request) {
//   try {
//     const { name, email, password, country, age } = await req.json();
//     const db = await readDB();

//     // Check if user already exists
//     const existingUser = db.users.find((user: any) => user.email === email);
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }

//     // Hash password before saving
//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = {
//       id: Date.now().toString(),
//       name,
//       email,
//       password: hashedPassword,
//       country,
//       age,
//     };

//     // Add new user to db.json
//     db.users.push(newUser);
//     await writeDB(db);

//     return NextResponse.json(
//       { message: "User registered successfully" },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
