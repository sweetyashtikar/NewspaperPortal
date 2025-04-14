import Employee from "../../model/EmployeeModal/Employee.js"
import Article from "../../model/EmployeeModal/ArticleModal.js"


// Create a new article
export const createArticle = async (req, res) => {
    // Check if user is authenticated
    // Replace this condition based on your authentication 
    console.log(req.user)
    if (!req.user) {  // Assuming req.user is set by an authentication middleware
        return res.status(401).json({ message: "Unauthorized: Please log in to create an article." });
    }
    // Destructure the article details from the request body
    const { title, content } = req.body;

    // Validate input data
    if (!title || !content ) {
        return res.status(400).json({ message: 'Title, content, and author are required.' });
    }

    try {
        // Create a new article instance
        const newArticle = new Article({
            title,
            content,
            author:req.user.employeeId, // Assuming author is the employee ID (ObjectId)
        });

        // Save the article to the database
        const savedArticle = await newArticle.save();
        
        // Respond with the created article
        res.status(201).json(savedArticle);
    } catch (error) {
        // Handle error
        res.status(500).json({ message: 'Error creating article', error: error.message });
    }
};