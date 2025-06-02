<!-- Brand Logo -->
<p align="center">
  <img src="../public/loopin-favicon.svg" alt="Loopin City Logo" width="180" />
</p>

# Loopin City

> **Brand Font:** Urbanist, Inter, Space Grotesk, Arial, sans-serif

---

<p align="center">
  <b>India's most community-driven tech events platform</b><br/>
  <i>Discover. Connect. Loop in.</i>
</p>

---

## ✨ Our Mission

> To empower every tech enthusiast, community, and venue partner to connect, be recognized, and thrive—no matter the city.

Loopin City is your open-source gateway to discovering and sharing local tech events, meetups, and opportunities. We believe in the power of community and the magic that happens when people come together to learn, build, and grow.

---

## 🚀 Features

- 🔍 **Event Discovery:** Find all upcoming tech events in your city, all in one place.
- 📝 **Easy Event Submission:** Anyone can submit events for admin review—no gatekeeping.
- 🏆 **Community Leaderboards:** Celebrate the most active communities and venues.
- 🌐 **Modern, Responsive UI:** Beautiful, accessible, and fast on any device.
- 🔗 **External RSVP:** We link you directly to organizers—no ticketing or attendee management here.
- 🤝 **Open Collaboration:** Built by the community, for the community.

---

## 🛠️ Getting Started

Ready to contribute or run Loopin City locally? Follow these steps:

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Loopin-city/loopin-city.git
   cd loopin-city
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   > ℹ️  Need test credentials? Ask a maintainer! Please do **not** use production credentials.
4. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173).
5. **Lint your code (recommended):**
   ```sh
   npm run lint
   ```
6. **Build for production (optional):**
   ```sh
   npm run build
   npm run preview
   ```

> ⚠️ **Backend/Database Changes:**
> - Working on the backend (database, SQL, or Supabase functions) is **not allowed** at this time.
> - Please focus your contributions on the frontend, UI/UX, and open source collaboration.
> - Backend contributions may be considered in the future—stay tuned!

---

## 🤝 How to Contribute

We love contributions from everyone! Here's how you can help:

- 🍴 **Fork the repo** and create your feature branch (`git checkout -b feature/YourFeature`)
- 💡 **Make your changes** and commit (`git commit -m 'Add some feature'`)
- 🚀 **Push to your branch** (`git push origin feature/YourFeature`)
- 🔄 **Open a Pull Request** and describe your changes
- 🙌 **Join the discussion**—review, comment, and help others!

See our [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

---

## 📚 Documentation

- All documentation is in the [`docs/`](./) folder.
- Check out:
  - [Community Duplicate Detection](COMMUNITY_DUPLICATE_DETECTION.md)
  - [Comprehensive Duplicate Detection System](COMPREHENSIVE_DUPLICATE_DETECTION_SYSTEM.md)
  - [Database-Driven Systems](DATABASE_SETUP.md)
  - [User & Admin Guides](DUPLICATE_DETECTION_DEBUG_GUIDE.md, ADMIN_VERIFICATION_CHECKLIST.md)

---

## 🌈 Community & Code of Conduct

We're committed to a welcoming, inclusive, and respectful community. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <b>Let's build the future of local tech communities together! ⭐</b>
</p> 