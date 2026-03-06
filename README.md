

# FiveM Job Creator

A configurable **in-game job creator for FiveM** that allows administrators to create **jobs and job grades directly from a modern UI** without manually editing the database.

![License](https://img.shields.io/badge/license-GPLv3-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

# ✨ Features

* 💼 **In-Game Job Creation** – Create new jobs without touching SQL
* 📊 **Grade Management** – Add multiple grades with salary and permissions
* ⚡ **Automatic Database Insertion** – Jobs and grades are inserted using oxmysql
* 🎨 **Modern UI** – Clean and simple interface for administrators
* 🔔 **ox_lib Notifications** – Clean in-game alerts and feedback
* 👨‍💼 **Admin Restricted Access** – Only admins can create or manage jobs
* 📊 **Version Checker** – Automatically checks GitHub for updates

---

# 📦 Dependencies

* [es_extended](https://github.com/esx-framework/esx_core)
* [ox_lib](https://github.com/overextended/ox_lib)
* [oxmysql](https://github.com/overextended/oxmysql)

---

# 🛠 Installation

1. Download the latest release
2. Extract it into your `resources` folder
3. Rename the folder to your desired resource name
4. Add the resource to your `server.cfg`

```cfg
ensure your-resource-name
```

5. Configure `config.lua`
6. Restart your server

---

# ⚙️ Configuration

Edit `config.lua` to configure permissions and script behavior.

Example configuration:

```lua
Config = {}

-- Admin groups that can access the job creator
Config.AdminGroups = {
    "admin",
    "superadmin"
}

-- Command used to open the job creator
Config.OpenCommand = "jobcreator"
```

---

# 💼 Creating Jobs

Admins can create jobs directly in-game through the job creator UI.

When creating a job you can configure:

* Job Name
* Job Label
* Multiple Job Grades
* Grade Labels
* Salaries
* Boss Permissions

All jobs and grades are automatically inserted into the database.

---

# 🗄 Database

The script inserts jobs into the standard ESX tables:

### Jobs Table

```sql
jobs
```

### Job Grades Table

```sql
job_grades
```

The script automatically inserts records using **oxmysql**, meaning **no manual SQL setup is required**.

---

# ⌨️ Commands

### Admin Commands

* `/jobcreator` – Open the job creation menu

> Requires **ESX admin or superadmin permissions**

---

# 📷 Screenshot

<p align="center">
  <img width="805" height="621" alt="Job Creator UI" src="https://github.com/user-attachments/assets/6878eb49-44ee-4e8c-8de7-e41fdbbefe01" />
</p>

---

# 🧩 Framework Support

* ✅ **ESX** – Available now
* ⏳ **QB-Core** – Coming next update
* ⏳ **QBOX** – Coming next update

---

# 🧩 Support

* Open an issue on GitHub for bugs or suggestions
* Please check existing issues before creating a new one

---

# 📄 License

This project is licensed under the **GPL License**.
