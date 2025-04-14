import Employee from "../../model/EmployeeModal/Employee.js";

export const updateEmployeeStatus = async (req, res) => {
  const { email, newStatus } = req.body;

  // Basic validation
  if (!email || !newStatus) {
    return res.status(400).json({ msg: "Email and new status are required." });
  }

  // Check for valid status values
  const validStatuses = ['active', 'inactive', 'pending'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ msg: "Invalid status value." });
  }

  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { email },
      { status: newStatus },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ msg: "Employee not found." });
    }

    res.status(200).json({
      msg: `Status updated to '${newStatus}' for ${email}`,
      employee: updatedEmployee,
    });
  } catch (err) {
    console.error("Error updating employee status:", err.message);
    res.status(500).json({ msg: "Server error. Please try again later." });
  }
};


//send an email when the status is updated to active, controller is yet to define, waiting for the frntend
