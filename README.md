# Loopin City

<div align="center">
  <img src="/public/loopin-favicon.svg" alt="Loopin City Favicon" width="180"/>
  <br/>
  <p><strong>India's most community-driven tech events platform</strong></p>
  <p><em>Discover. Connect. Loop in.</em></p>
</div>

## ✨ Our Mission

> To empower every tech enthusiast, community, and venue partner to connect, be recognized, and thrive—no matter the city.

Loopin City is your open-source gateway to discovering and sharing local tech events, meetups, and opportunities. We believe in the power of community and the magic that happens when people come together to learn, build, and grow.

## 🚀 Features

- 🔍 **Event Discovery:** Find all upcoming tech events in your city, all in one place
- 📝 **Easy Event Submission:** Anyone can submit events for admin review—no gatekeeping
- 🏆 **Community Leaderboards:** Celebrate the most active communities and venues
- 🌐 **Modern, Responsive UI:** Beautiful, accessible, and fast on any device
- 🔗 **External RSVP:** We link you directly to organizers—no ticketing or attendee management here
- 🤝 **Open Collaboration:** Built by the community, for the community

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, TailwindCSS
- **Backend:** Supabase
- **UI Components:** Lucide Icons
- **Styling:** TailwindCSS with custom design system
- **Deployment:** Vercel

## 🏗️ Project Structure

```
loopin-city/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── contexts/      # React contexts
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
├── public/            # Static assets
└── docs/             # Documentation
```

## 🚀 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Loopin-city/loopin-city.git
   cd loopin-city
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   > ℹ️ Need test credentials? Ask a maintainer! Please do **not** use production credentials.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:5173

5. **Lint your code (recommended):**
   ```bash
   npm run lint
   ```

6. **Build for production (optional):**
   ```bash
   npm run build
   npm run preview
   ```

## 🤝 How to Contribute

We love contributions from everyone! Here's how you can help:

1. 🍴 **Fork the repo** and create your feature branch (`git checkout -b feature/YourFeature`)
2. 💡 **Make your changes** and commit (`git commit -m 'Add some feature'`)
3. 🚀 **Push to your branch** (`git push origin feature/YourFeature`)
4. 🔄 **Open a Pull Request** and describe your changes
5. 🙌 **Join the discussion**—review, comment, and help others!

### Contribution Guidelines

- Follow the existing code style and conventions
- Write clear commit messages and PR descriptions
- Test your changes before submitting
- Update documentation if needed
- Be respectful and inclusive to all contributors

## 📚 Documentation

- All documentation is in the `docs/` folder
- Check out our guides:
  - [Community Guidelines](docs/COMMUNITY_GUIDELINES.md)
  - [Contributing Guide](docs/CONTRIBUTING.md)
  - [Code of Conduct](docs/CODE_OF_CONDUCT.md)

## 🌈 Community

- Join our [Discord Server](https://discord.gg/loopin-city)
- Follow us on [LinkedIn](https://linkedin.com/company/loopin)
- Email us at support@loopin.city

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>Made with ❤️ by the Loopin City community</p>
  <p>Let's build the future of local tech communities together! ⭐</p>
</div> 