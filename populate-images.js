import "dotenv/config";
import mongoose from "mongoose";
import CoursesDao from "./Kambaz/Courses/dao.js";
import seedCourses from "./Kambaz/Database/courses.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";

async function populateImages() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(CONNECTION_STRING);
    console.log("Connected to MongoDB\n");

    const dao = CoursesDao({}); // DAO doesn't need db parameter for MongoDB operations
    
    let updated = 0;
    let notFound = 0;
    
    console.log("Populating course images...\n");
    
    for (const seedCourse of seedCourses) {
      // Check if course exists first
      const course = await dao.findCourseById(seedCourse._id);
      if (course) {
        const result = await dao.updateCourse(seedCourse._id, { image: seedCourse.image });
        if (result.modifiedCount > 0) {
          console.log(`✅ Updated ${seedCourse._id} (${seedCourse.name}) with image: ${seedCourse.image}`);
          updated++;
        } else {
          console.log(`ℹ️  ${seedCourse._id} (${seedCourse.name}) already has image`);
        }
      } else {
        console.log(`⚠️  Course ${seedCourse._id} (${seedCourse.name}) not found in database`);
        notFound++;
      }
    }
    
    console.log(`\n✅ Summary:`);
    console.log(`   - Updated: ${updated} courses`);
    console.log(`   - Not found: ${notFound} courses`);
    console.log(`   - Total: ${seedCourses.length} courses`);
    
    await mongoose.disconnect();
    console.log("\n✅ Done!");
    process.exit(0);
  } catch (error) {
    console.error("Error populating images:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

populateImages();

