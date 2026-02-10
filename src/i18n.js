import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const storedLanguage = typeof window !== 'undefined'
  ? window.localStorage.getItem('appLanguage')
  : null;

const rtlLanguages = new Set(['ar', 'ur']);

const resources = {
  en: {
    translation: {
      nav: {
        home: 'Home',
        about: 'About',
        events: 'Events',
        sports: 'Sports',
        socialWork: 'Social Work',
        gallery: 'Gallery',
        members: 'Members',
        news: 'News',
        testimonials: 'Testimonials',
        socialFeed: 'Social Feed',
        pressMentions: 'Press Mentions',
        contact: 'Contact',
        themeLight: 'Switch to light mode',
        themeDark: 'Switch to dark mode',
        language: 'Language'
      },
      footer: {
        taglineFallback: 'A Family of Friends',
        description: "Bondhu Gosthi is more than just a club - it's a family dedicated to bringing people together through sports, cultural events, and community service. Join us in making a difference!",
        quickLinks: 'Quick Links',
        importantLinks: 'Important Links',
        getInTouch: 'Get In Touch',
        adminLogin: 'Admin Login',
        copyright: 'Copyright {{year}} Bondhu Gosthi.',
        madeWith: 'Made with',
        byTeam: 'by Our Team'
      },
      common: {
        loading: 'Loading...',
        loadingHome: 'Loading home page...',
        learnMore: 'Learn More',
        viewAllEvents: 'View All Events',
        viewAllNews: 'View All News',
        readMore: 'Read More',
        getInTouch: 'Get in Touch',
        sendMessage: 'Send Message',
        sending: 'Sending...',
        submit: 'Submit',
        search: 'Search',
        viewWebsite: 'View Website',
        logout: 'Logout',
        adminPanel: 'Admin Panel',
        noData: 'No data available',
        noUpcomingEvents: 'No upcoming events at the moment. Check back soon!',
        viewFullGallery: 'View Full Gallery',
        exploreLatestAlbum: 'Explore Latest Album',
        noAlbums: 'No albums yet',
        uploadFirstGallery: 'Upload your first gallery to start showcasing club memories.',
        albums: 'Albums',
        photos: 'Photos',
        latest: 'Latest',
        eventsOrganized: 'Events Organized',
        activeMembers: 'Active Members',
        socialInitiatives: 'Social Initiatives',
        tournaments: 'Tournaments',
        followUs: 'Follow Us',
        stayConnected: 'Stay connected on social media',
        findUs: 'Find Us'
      },
      home: {
        hero: {
          titleTop: 'Welcome to',
          titleMain: 'Bondhu Gosthi',
          subtitle: 'A Family of Friends',
          description: 'Join us in creating memorable experiences through sports, culture, and community service',
          primaryCta: 'Join Our Club',
          secondaryCta: 'About Us'
        },
        about: {
          title: 'About Bondhu Gosthi',
          subtitle: "More Than Just a Club - We're a Family",
          text1: "Bondhu Gosthi is a vibrant community where friendships flourish and memories are made. Since our establishment, we've been dedicated to bringing people together through sports, cultural events, and meaningful social work.",
          text2: 'Our mission is to create a positive impact in society while fostering brotherhood, sportsmanship, and cultural awareness among our members and the community at large.',
          cta: 'Learn More About Us'
        },
        features: {
          title: 'What We Offer',
          subtitle: 'Discover the many ways to be part of our community',
          items: {
            cultural: {
              title: 'Cultural Events',
              description: 'Experience vibrant cultural programs and festivals throughout the year'
            },
            sports: {
              title: 'Sports Tournaments',
              description: 'Compete in various sports tournaments and showcase your talent'
            },
            social: {
              title: 'Social Work',
              description: 'Join our community service initiatives and make a positive impact'
            },
            moments: {
              title: 'Memorable Moments',
              description: 'Capture and cherish beautiful memories with our photo galleries'
            }
          }
        },
        events: {
          title: 'Upcoming Events',
          subtitle: "Don't miss out on our exciting events"
        },
        gallery: {
          kicker: 'Captured Moments',
          title: 'Every frame tells our story',
          subtitle: "Relive the beautiful memories we've created together"
        },
        news: {
          title: 'Latest News',
          subtitle: 'Stay updated with our recent announcements'
        },
        cta: {
          title: 'Join Our Community',
          description: 'Be part of something bigger. Connect with like-minded individuals and make a difference.',
          button: 'Get in Touch'
        }
      },
      about: {
        pageTitle: 'About Us',
        pageSubtitle: 'Learn about our journey, values, and the family that makes Bondhu Gosthi special',
        missionTitle: 'Our Mission',
        missionText: 'To create a vibrant community that brings people together through sports, cultural activities, and social work, fostering brotherhood and making a positive impact on society.',
        visionTitle: 'Our Vision',
        visionText: 'To be recognized as a leading community organization that exemplifies unity, excellence, and social responsibility, inspiring others to contribute to the betterment of society.',
        storyTitle: 'Our Story',
        storySubtitle: 'How Bondhu Gosthi Became a Family',
        storyP1: 'Bondhu Gosthi began in 2010 with a simple idea: to create a space where friends could come together, celebrate life, and make a difference in their community. What started as a small group of friends has grown into a family of over 500 active members.',
        storyP2: "Over the years, we've organized countless events, from exciting sports tournaments to vibrant cultural celebrations like Ganapati Puja. But more importantly, we've touched thousands of lives through our social work initiatives, providing food, education support, and assistance to those in need.",
        storyP3: 'Today, Bondhu Gosthi stands as a testament to the power of friendship and community. We are not just a club - we are a family that supports each other, celebrates together, and works hand in hand to create a better tomorrow.',
        valuesTitle: 'Our Core Values',
        valuesSubtitle: 'The principles that guide everything we do',
        values: {
          brotherhood: {
            title: 'Brotherhood',
            description: 'We believe in the power of friendship and unity. Our community is built on mutual respect, trust, and genuine care for one another.'
          },
          service: {
            title: 'Community Service',
            description: 'Giving back to society is at the heart of everything we do. We actively participate in social work to make a positive difference.'
          },
          excellence: {
            title: 'Excellence',
            description: 'We strive for excellence in all our endeavors, whether in sports, cultural activities, or community initiatives.'
          },
          inclusivity: {
            title: 'Inclusivity',
            description: 'Our doors are open to everyone. We celebrate diversity and welcome people from all backgrounds to be part of our family.'
          }
        },
        journeyTitle: 'Our Journey',
        journeySubtitle: 'Key milestones in our history',
        milestones: {
          foundation: {
            title: 'Foundation',
            description: 'Bondhu Gosthi was established with a vision to create a community of friends'
          },
          firstTournament: {
            title: 'First Tournament',
            description: 'Organized our first inter-club cricket tournament'
          },
          socialInitiative: {
            title: 'Social Initiative',
            description: 'Launched our first large-scale food distribution program'
          },
          culturalExcellence: {
            title: 'Cultural Excellence',
            description: 'Hosted the biggest Ganapati Puja celebration in the region'
          },
          pandemicSupport: {
            title: 'Pandemic Support',
            description: 'Provided essential supplies to 1000+ families during COVID-19'
          },
          growingStrong: {
            title: 'Growing Strong',
            description: '500+ active members and 150+ events organized'
          }
        },
        ctaTitle: 'Want to Be Part of Our Family?',
        ctaDescription: 'Join Bondhu Gosthi and be part of something meaningful. Together, we can create beautiful memories and make a positive impact on our community.',
        ctaButton: 'Get in Touch'
      },
      contact: {
        pageTitle: 'Get In Touch',
        pageSubtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
        sendMessageTitle: 'Send Us a Message',
        sendMessageSubtitle: "Fill out the form below and we'll get back to you as soon as possible.",
        fullName: 'Full Name *',
        emailAddress: 'Email Address *',
        phoneNumber: 'Phone Number',
        category: 'Category *',
        subject: 'Subject *',
        message: 'Message *',
        namePlaceholder: 'John Doe',
        emailPlaceholder: 'john@example.com',
        phonePlaceholder: '+91 98765 43210',
        subjectPlaceholder: 'What is this regarding?',
        messagePlaceholder: 'Write your message here...',
        categoryOptions: {
          general: 'General Inquiry',
          event: 'Event Related',
          membership: 'Membership',
          complaint: 'Complaint',
          suggestion: 'Suggestion',
          other: 'Other'
        },
        contactInfo: {
          email: 'Email',
          phone: 'Phone',
          location: 'Location'
        },
        followUs: 'Follow Us',
        followSubtitle: 'Stay connected on social media',
        findUs: 'Find Us',
        toastSuccess: 'Message sent successfully! We will get back to you soon.',
        toastError: 'Failed to send message. Please try again.'
      },
      login: {
        title: 'Admin Login',
        subtitle: 'Bondhu Gosthi Management Portal',
        emailLabel: 'Email Address',
        passwordLabel: 'Password',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        loginButton: 'Login',
        success: 'Login successful! Welcome back.',
        invalid: 'Invalid credentials. Please try again.',
        error: 'An error occurred. Please try again.',
        togglePassword: 'Toggle password visibility',
        loggingIn: 'Logging in...',
        secureNote: 'This is a secure admin portal. Only authorized personnel can access.'
      },
      notFound: {
        title: 'Page Not Found',
        subtitle: "The page you're looking for doesn't exist.",
        backHome: 'Back to Home'
      },
      admin: {
        dashboard: 'Dashboard',
        events: 'Events',
        sports: 'Sports',
        socialWork: 'Social Work',
        gallery: 'Gallery',
        sliderImages: 'Slider Images',
        members: 'Members',
        news: 'News',
        contact: 'Contact',
        pages: 'Pages',
        homeEdit: 'Home Edit',
        aboutEdit: 'About Edit',
        contactEdit: 'Contact Edit',
        footerEdit: 'Footer Edit',
        settings: 'Settings',
        seo: 'SEO',
        usersRoles: 'Users & Roles',
        backups: 'Backups',
        security: 'Security',
        activityLogs: 'Activity Logs',
        viewWebsite: 'View Website',
        logout: 'Logout',
        adminPanel: 'Admin Panel'
      }
    }
  },
  zh: {
    translation: {
      nav: {
        home: '首页',
        about: '关于我们',
        events: '活动',
        sports: '体育',
        socialWork: '社会服务',
        gallery: '相册',
        members: '成员',
        news: '新闻',
        contact: '联系我们',
        themeLight: '切换到浅色模式',
        themeDark: '切换到深色模式',
        language: '语言'
      },
      footer: {
        taglineFallback: '朋友的大家庭',
        description: 'Bondhu Gosthi 不只是一个俱乐部，更是一个通过体育、文化活动和社区服务把大家凝聚在一起的家庭。加入我们，一起创造改变！',
        quickLinks: '快速链接',
        importantLinks: '重要链接',
        getInTouch: '联系我们',
        adminLogin: '管理员登录',
        copyright: '版权 {{year}} Bondhu Gosthi。',
        madeWith: '用心制作',
        byTeam: '团队出品'
      },
      common: {
        loading: '加载中...',
        loadingHome: '主页加载中...',
        learnMore: '了解更多',
        viewAllEvents: '查看所有活动',
        viewAllNews: '查看所有新闻',
        readMore: '阅读更多',
        getInTouch: '联系我们',
        sendMessage: '发送消息',
        sending: '发送中...',
        submit: '提交',
        search: '搜索',
        viewWebsite: '查看网站',
        logout: '退出登录',
        adminPanel: '管理面板',
        noData: '暂无数据',
        noUpcomingEvents: '目前没有即将举行的活动，请稍后再来！',
        viewFullGallery: '查看完整相册',
        exploreLatestAlbum: '查看最新相册',
        noAlbums: '暂无相册',
        uploadFirstGallery: '上传您的第一个相册，开始展示俱乐部回忆。',
        albums: '相册',
        photos: '照片',
        latest: '最新',
        eventsOrganized: '已举办活动',
        activeMembers: '活跃成员',
        socialInitiatives: '公益活动',
        tournaments: '锦标赛',
        followUs: '关注我们',
        stayConnected: '在社交媒体保持联系',
        findUs: '找到我们'
      },
      login: {
        title: '管理员登录',
        subtitle: 'Bondhu Gosthi 管理门户',
        emailLabel: '邮箱',
        passwordLabel: '密码',
        emailPlaceholder: '请输入邮箱',
        passwordPlaceholder: '请输入密码',
        loginButton: '登录',
        success: '登录成功！欢迎回来。',
        invalid: '凭据无效，请重试。',
        error: '发生错误，请重试。',
        togglePassword: '切换密码显示',
        loggingIn: '正在登录...',
        secureNote: '这是安全的管理员门户，仅授权人员可访问。'
      },
      notFound: {
        title: '页面不存在',
        subtitle: '您访问的页面不存在。',
        backHome: '返回首页'
      },
      admin: {
        dashboard: '仪表盘',
        events: '活动',
        sports: '体育',
        socialWork: '社会服务',
        gallery: '相册',
        sliderImages: '轮播图',
        members: '成员',
        news: '新闻',
        contact: '联系',
        pages: '页面',
        homeEdit: '主页编辑',
        aboutEdit: '关于编辑',
        contactEdit: '联系编辑',
        footerEdit: '页脚编辑',
        settings: '设置',
        seo: 'SEO',
        usersRoles: '用户与角色',
        backups: '备份',
        security: '安全',
        activityLogs: '活动日志',
        viewWebsite: '查看网站',
        logout: '退出登录',
        adminPanel: '管理面板'
      }
    }
  }
  ,
  hi: {
    translation: {
      nav: {
        home: 'होम',
        about: 'हमारे बारे में',
        events: 'कार्यक्रम',
        sports: 'खेल',
        socialWork: 'सामाजिक कार्य',
        gallery: 'गैलरी',
        members: 'सदस्य',
        news: 'समाचार',
        contact: 'संपर्क',
        themeLight: 'लाइट मोड पर जाएँ',
        themeDark: 'डार्क मोड पर जाएँ',
        language: 'भाषा'
      },
      footer: {
        taglineFallback: 'दोस्तों का परिवार',
        description: 'Bondhu Gosthi सिर्फ एक क्लब नहीं है, यह एक परिवार है जो खेल, सांस्कृतिक कार्यक्रम और सामुदायिक सेवा के माध्यम से लोगों को जोड़ता है। हमारे साथ बदलाव लाएँ!',
        quickLinks: 'त्वरित लिंक',
        importantLinks: 'महत्वपूर्ण लिंक',
        getInTouch: 'संपर्क करें',
        adminLogin: 'एडमिन लॉगिन',
        copyright: 'कॉपीराइट {{year}} Bondhu Gosthi।',
        madeWith: 'प्यार से बनाया',
        byTeam: 'हमारी टीम द्वारा'
      },
      common: {
        loading: 'लोड हो रहा है...',
        loadingHome: 'होम पेज लोड हो रहा है...',
        learnMore: 'और जानें',
        viewAllEvents: 'सभी कार्यक्रम देखें',
        viewAllNews: 'सभी समाचार देखें',
        readMore: 'और पढ़ें',
        getInTouch: 'संपर्क करें',
        sendMessage: 'संदेश भेजें',
        sending: 'भेजा जा रहा है...',
        submit: 'सबमिट',
        search: 'खोजें',
        viewWebsite: 'वेबसाइट देखें',
        logout: 'लॉगआउट',
        adminPanel: 'एडमिन पैनल',
        noData: 'डेटा उपलब्ध नहीं है',
        noUpcomingEvents: 'फिलहाल कोई आगामी कार्यक्रम नहीं है। कृपया बाद में देखें!',
        viewFullGallery: 'पूरी गैलरी देखें',
        exploreLatestAlbum: 'नवीनतम एल्बम देखें',
        noAlbums: 'कोई एल्बम नहीं',
        uploadFirstGallery: 'अपनी पहली गैलरी अपलोड करें और यादें साझा करें।',
        albums: 'एल्बम',
        photos: 'फोटो',
        latest: 'नवीनतम',
        eventsOrganized: 'आयोजित कार्यक्रम',
        activeMembers: 'सक्रिय सदस्य',
        socialInitiatives: 'सामाजिक पहल',
        tournaments: 'टूर्नामेंट',
        followUs: 'हमें फॉलो करें',
        stayConnected: 'सोशल मीडिया पर जुड़े रहें',
        findUs: 'हमें खोजें'
      },
      login: {
        title: 'एडमिन लॉगिन',
        subtitle: 'Bondhu Gosthi प्रबंधन पोर्टल',
        emailLabel: 'ईमेल',
        passwordLabel: 'पासवर्ड',
        emailPlaceholder: 'अपना ईमेल दर्ज करें',
        passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
        loginButton: 'लॉगिन',
        success: 'लॉगिन सफल! स्वागत है।',
        invalid: 'गलत जानकारी। कृपया पुनः प्रयास करें।',
        error: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।',
        togglePassword: 'पासवर्ड दिखाएँ/छिपाएँ',
        loggingIn: 'लॉगिन हो रहा है...',
        secureNote: 'यह एक सुरक्षित एडमिन पोर्टल है। केवल अधिकृत व्यक्ति ही एक्सेस कर सकते हैं।'
      },
      notFound: {
        title: 'पेज नहीं मिला',
        subtitle: 'आप जिस पेज को ढूंढ रहे हैं वह उपलब्ध नहीं है।',
        backHome: 'होम पर जाएँ'
      },
      admin: {
        dashboard: 'डैशबोर्ड',
        events: 'कार्यक्रम',
        sports: 'खेल',
        socialWork: 'सामाजिक कार्य',
        gallery: 'गैलरी',
        sliderImages: 'स्लाइडर चित्र',
        members: 'सदस्य',
        news: 'समाचार',
        contact: 'संपर्क',
        pages: 'पेज',
        homeEdit: 'हোম संपादन',
        aboutEdit: 'अबाउट संपादन',
        contactEdit: 'संपर्क संपादन',
        footerEdit: 'फूटर संपादन',
        settings: 'सेटिंग्स',
        seo: 'SEO',
        usersRoles: 'यूज़र और रोल',
        backups: 'बैकअप',
        security: 'सुरक्षा',
        activityLogs: 'गतिविधि लॉग',
        viewWebsite: 'वेबसाइट देखें',
        logout: 'लॉगआउट',
        adminPanel: 'एडमिन पैनल'
      }
    }
  }
  ,
  es: {
    translation: {
      nav: {
        home: 'Inicio',
        about: 'Acerca de',
        events: 'Eventos',
        sports: 'Deportes',
        socialWork: 'Trabajo social',
        gallery: 'Galería',
        members: 'Miembros',
        news: 'Noticias',
        contact: 'Contacto',
        themeLight: 'Cambiar a modo claro',
        themeDark: 'Cambiar a modo oscuro',
        language: 'Idioma'
      },
      footer: {
        taglineFallback: 'Una familia de amigos',
        description: 'Bondhu Gosthi es más que un club: es una familia que une a las personas a través del deporte, la cultura y el servicio comunitario. ¡Únete y marca la diferencia!',
        quickLinks: 'Enlaces rápidos',
        importantLinks: 'Enlaces importantes',
        getInTouch: 'Contáctanos',
        adminLogin: 'Acceso administrador',
        copyright: 'Copyright {{year}} Bondhu Gosthi.',
        madeWith: 'Hecho con',
        byTeam: 'por nuestro equipo'
      },
      common: {
        loading: 'Cargando...',
        loadingHome: 'Cargando página de inicio...',
        learnMore: 'Saber más',
        viewAllEvents: 'Ver todos los eventos',
        viewAllNews: 'Ver todas las noticias',
        readMore: 'Leer más',
        getInTouch: 'Contáctanos',
        sendMessage: 'Enviar mensaje',
        sending: 'Enviando...',
        submit: 'Enviar',
        search: 'Buscar',
        viewWebsite: 'Ver sitio web',
        logout: 'Cerrar sesión',
        adminPanel: 'Panel de administración',
        noData: 'No hay datos disponibles',
        noUpcomingEvents: 'No hay eventos próximos por ahora. ¡Vuelve pronto!',
        viewFullGallery: 'Ver galería completa',
        exploreLatestAlbum: 'Explorar el último álbum',
        noAlbums: 'Aún no hay álbumes',
        uploadFirstGallery: 'Sube tu primera galería para compartir recuerdos.',
        albums: 'Álbumes',
        photos: 'Fotos',
        latest: 'Último',
        eventsOrganized: 'Eventos organizados',
        activeMembers: 'Miembros activos',
        socialInitiatives: 'Iniciativas sociales',
        tournaments: 'Torneos',
        followUs: 'Síguenos',
        stayConnected: 'Mantente conectado en redes sociales',
        findUs: 'Encuéntranos'
      },
      login: {
        title: 'Acceso administrador',
        subtitle: 'Portal de gestión de Bondhu Gosthi',
        emailLabel: 'Correo electrónico',
        passwordLabel: 'Contraseña',
        emailPlaceholder: 'Ingresa tu correo',
        passwordPlaceholder: 'Ingresa tu contraseña',
        loginButton: 'Iniciar sesión',
        success: '¡Inicio de sesión correcto! Bienvenido.',
        invalid: 'Credenciales inválidas. Inténtalo de nuevo.',
        error: 'Ocurrió un error. Inténtalo de nuevo.',
        togglePassword: 'Alternar visibilidad de contraseña',
        loggingIn: 'Iniciando sesión...',
        secureNote: 'Este es un portal de administración seguro. Solo personal autorizado puede acceder.'
      },
      notFound: {
        title: 'Página no encontrada',
        subtitle: 'La página que buscas no existe.',
        backHome: 'Volver al inicio'
      },
      admin: {
        dashboard: 'Panel',
        events: 'Eventos',
        sports: 'Deportes',
        socialWork: 'Trabajo social',
        gallery: 'Galería',
        sliderImages: 'Imágenes del slider',
        members: 'Miembros',
        news: 'Noticias',
        contact: 'Contacto',
        pages: 'Páginas',
        homeEdit: 'Editar inicio',
        aboutEdit: 'Editar acerca de',
        contactEdit: 'Editar contacto',
        footerEdit: 'Editar pie',
        settings: 'Ajustes',
        seo: 'SEO',
        usersRoles: 'Usuarios y roles',
        backups: 'Copias de seguridad',
        security: 'Seguridad',
        activityLogs: 'Registro de actividad',
        viewWebsite: 'Ver sitio web',
        logout: 'Cerrar sesión',
        adminPanel: 'Panel de administración'
      }
    }
  }
  ,
  ar: {
    translation: {
      nav: {
        home: 'الرئيسية',
        about: 'من نحن',
        events: 'الفعاليات',
        sports: 'الرياضة',
        socialWork: 'العمل الاجتماعي',
        gallery: 'المعرض',
        members: 'الأعضاء',
        news: 'الأخبار',
        contact: 'اتصل بنا',
        themeLight: 'التبديل إلى الوضع الفاتح',
        themeDark: 'التبديل إلى الوضع الداكن',
        language: 'اللغة'
      },
      footer: {
        taglineFallback: 'عائلة من الأصدقاء',
        description: 'Bondhu Gosthi أكثر من مجرد نادٍ؛ إنها عائلة تجمع الناس من خلال الرياضة والثقافة وخدمة المجتمع. انضم إلينا لإحداث فرق!',
        quickLinks: 'روابط سريعة',
        importantLinks: 'روابط مهمة',
        getInTouch: 'تواصل معنا',
        adminLogin: 'تسجيل دخول المدير',
        copyright: 'حقوق النشر {{year}} Bondhu Gosthi.',
        madeWith: 'صُنع بكل حب',
        byTeam: 'بواسطة فريقنا'
      },
      common: {
        loading: 'جارٍ التحميل...',
        loadingHome: 'جارٍ تحميل الصفحة الرئيسية...',
        learnMore: 'اعرف المزيد',
        viewAllEvents: 'عرض جميع الفعاليات',
        viewAllNews: 'عرض جميع الأخبار',
        readMore: 'اقرأ المزيد',
        getInTouch: 'تواصل معنا',
        sendMessage: 'إرسال رسالة',
        sending: 'جارٍ الإرسال...',
        submit: 'إرسال',
        search: 'بحث',
        viewWebsite: 'عرض الموقع',
        logout: 'تسجيل الخروج',
        adminPanel: 'لوحة الإدارة',
        noData: 'لا توجد بيانات',
        noUpcomingEvents: 'لا توجد فعاليات قادمة حاليًا. عد لاحقًا!',
        viewFullGallery: 'عرض المعرض بالكامل',
        exploreLatestAlbum: 'استكشاف أحدث ألبوم',
        noAlbums: 'لا توجد ألبومات بعد',
        uploadFirstGallery: 'ارفع أول معرض لعرض ذكريات النادي.',
        albums: 'الألبومات',
        photos: 'الصور',
        latest: 'الأحدث',
        eventsOrganized: 'الفعاليات المنظمة',
        activeMembers: 'الأعضاء النشطون',
        socialInitiatives: 'المبادرات الاجتماعية',
        tournaments: 'البطولات',
        followUs: 'تابعنا',
        stayConnected: 'ابقَ على تواصل عبر وسائل التواصل',
        findUs: 'اعثر علينا'
      },
      login: {
        title: 'تسجيل دخول المدير',
        subtitle: 'بوابة إدارة Bondhu Gosthi',
        emailLabel: 'البريد الإلكتروني',
        passwordLabel: 'كلمة المرور',
        emailPlaceholder: 'أدخل بريدك الإلكتروني',
        passwordPlaceholder: 'أدخل كلمة المرور',
        loginButton: 'تسجيل الدخول',
        success: 'تم تسجيل الدخول بنجاح! مرحبًا بعودتك.',
        invalid: 'بيانات غير صحيحة. حاول مرة أخرى.',
        error: 'حدث خطأ. حاول مرة أخرى.',
        togglePassword: 'إظهار/إخفاء كلمة المرور',
        loggingIn: 'جارٍ تسجيل الدخول...',
        secureNote: 'هذه بوابة إدارة آمنة. يُسمح فقط للموظفين المصرح لهم بالدخول.'
      },
      notFound: {
        title: 'الصفحة غير موجودة',
        subtitle: 'الصفحة التي تبحث عنها غير موجودة.',
        backHome: 'العودة للرئيسية'
      },
      admin: {
        dashboard: 'لوحة التحكم',
        events: 'الفعاليات',
        sports: 'الرياضة',
        socialWork: 'العمل الاجتماعي',
        gallery: 'المعرض',
        sliderImages: 'صور السلايدر',
        members: 'الأعضاء',
        news: 'الأخبار',
        contact: 'اتصال',
        pages: 'الصفحات',
        homeEdit: 'تعديل الرئيسية',
        aboutEdit: 'تعديل من نحن',
        contactEdit: 'تعديل الاتصال',
        footerEdit: 'تعديل التذييل',
        settings: 'الإعدادات',
        seo: 'تهيئة محركات البحث',
        usersRoles: 'المستخدمون والأدوار',
        backups: 'النسخ الاحتياطية',
        security: 'الأمان',
        activityLogs: 'سجل الأنشطة',
        viewWebsite: 'عرض الموقع',
        logout: 'تسجيل الخروج',
        adminPanel: 'لوحة الإدارة'
      }
    }
  }
  ,
  fr: {
    translation: {
      nav: {
        home: 'Accueil',
        about: 'À propos',
        events: 'Événements',
        sports: 'Sports',
        socialWork: 'Action sociale',
        gallery: 'Galerie',
        members: 'Membres',
        news: 'Actualités',
        contact: 'Contact',
        themeLight: 'Passer en mode clair',
        themeDark: 'Passer en mode sombre',
        language: 'Langue'
      },
      footer: {
        taglineFallback: 'Une famille d’amis',
        description: 'Bondhu Gosthi est plus qu’un club : une famille qui rassemble les gens à travers le sport, la culture et le service communautaire. Rejoignez-nous pour faire la différence !',
        quickLinks: 'Liens rapides',
        importantLinks: 'Liens importants',
        getInTouch: 'Contactez-nous',
        adminLogin: 'Connexion admin',
        copyright: 'Copyright {{year}} Bondhu Gosthi.',
        madeWith: 'Fait avec',
        byTeam: 'par notre équipe'
      },
      common: {
        loading: 'Chargement...',
        loadingHome: 'Chargement de la page d’accueil...',
        learnMore: 'En savoir plus',
        viewAllEvents: 'Voir tous les événements',
        viewAllNews: 'Voir toutes les actualités',
        readMore: 'Lire la suite',
        getInTouch: 'Contactez-nous',
        sendMessage: 'Envoyer un message',
        sending: 'Envoi...',
        submit: 'Envoyer',
        search: 'Rechercher',
        viewWebsite: 'Voir le site',
        logout: 'Déconnexion',
        adminPanel: 'Panneau d’administration',
        noData: 'Aucune donnée disponible',
        noUpcomingEvents: 'Aucun événement à venir pour le moment. Revenez bientôt !',
        viewFullGallery: 'Voir la galerie complète',
        exploreLatestAlbum: 'Voir le dernier album',
        noAlbums: 'Aucun album pour le moment',
        uploadFirstGallery: 'Téléversez votre première galerie pour partager vos souvenirs.',
        albums: 'Albums',
        photos: 'Photos',
        latest: 'Dernier',
        eventsOrganized: 'Événements organisés',
        activeMembers: 'Membres actifs',
        socialInitiatives: 'Initiatives sociales',
        tournaments: 'Tournois',
        followUs: 'Suivez-nous',
        stayConnected: 'Restez connecté sur les réseaux sociaux',
        findUs: 'Nous trouver'
      },
      login: {
        title: 'Connexion admin',
        subtitle: 'Portail de gestion Bondhu Gosthi',
        emailLabel: 'E-mail',
        passwordLabel: 'Mot de passe',
        emailPlaceholder: 'Entrez votre e-mail',
        passwordPlaceholder: 'Entrez votre mot de passe',
        loginButton: 'Se connecter',
        success: 'Connexion réussie ! Bon retour.',
        invalid: 'Identifiants invalides. Veuillez réessayer.',
        error: 'Une erreur est survenue. Veuillez réessayer.',
        togglePassword: 'Afficher/masquer le mot de passe',
        loggingIn: 'Connexion...',
        secureNote: 'Ceci est un portail admin sécurisé. Seul le personnel autorisé peut accéder.'
      },
      notFound: {
        title: 'Page introuvable',
        subtitle: 'La page que vous cherchez n’existe pas.',
        backHome: 'Retour à l’accueil'
      },
      admin: {
        dashboard: 'Tableau de bord',
        events: 'Événements',
        sports: 'Sports',
        socialWork: 'Action sociale',
        gallery: 'Galerie',
        sliderImages: 'Images du slider',
        members: 'Membres',
        news: 'Actualités',
        contact: 'Contact',
        pages: 'Pages',
        homeEdit: 'Édition accueil',
        aboutEdit: 'Édition à propos',
        contactEdit: 'Édition contact',
        footerEdit: 'Édition pied de page',
        settings: 'Paramètres',
        seo: 'SEO',
        usersRoles: 'Utilisateurs & rôles',
        backups: 'Sauvegardes',
        security: 'Sécurité',
        activityLogs: 'Journal d’activité',
        viewWebsite: 'Voir le site',
        logout: 'Déconnexion',
        adminPanel: 'Panneau d’administration'
      }
    }
  }
  ,
  bn: {
    translation: {
      nav: {
        home: 'হোম',
        about: 'আমাদের সম্পর্কে',
        events: 'ইভেন্ট',
        sports: 'খেলা',
        socialWork: 'সামাজিক কাজ',
        gallery: 'গ্যালারি',
        members: 'সদস্য',
        news: 'সংবাদ',
        contact: 'যোগাযোগ',
        themeLight: 'লাইট মোডে যান',
        themeDark: 'ডার্ক মোডে যান',
        language: 'ভাষা'
      },
      footer: {
        taglineFallback: 'বন্ধুদের পরিবার',
        description: 'Bondhu Gosthi শুধু একটি ক্লাব নয়—এটি একটি পরিবার, যা খেলাধুলা, সাংস্কৃতিক অনুষ্ঠান এবং কমিউনিটি সার্ভিসের মাধ্যমে মানুষকে একত্রিত করে। আমাদের সাথে পরিবর্তন আনুন!',
        quickLinks: 'দ্রুত লিংক',
        importantLinks: 'গুরুত্বপূর্ণ লিংক',
        getInTouch: 'যোগাযোগ করুন',
        adminLogin: 'অ্যাডমিন লগইন',
        copyright: 'কপিরাইট {{year}} Bondhu Gosthi।',
        madeWith: 'ভালোবাসা দিয়ে তৈরি',
        byTeam: 'আমাদের টিম দ্বারা'
      },
      common: {
        loading: 'লোড হচ্ছে...',
        loadingHome: 'হোম পেজ লোড হচ্ছে...',
        learnMore: 'আরও জানুন',
        viewAllEvents: 'সব ইভেন্ট দেখুন',
        viewAllNews: 'সব সংবাদ দেখুন',
        readMore: 'আরও পড়ুন',
        getInTouch: 'যোগাযোগ করুন',
        sendMessage: 'বার্তা পাঠান',
        sending: 'পাঠানো হচ্ছে...',
        submit: 'জমা দিন',
        search: 'খুঁজুন',
        viewWebsite: 'ওয়েবসাইট দেখুন',
        logout: 'লগআউট',
        adminPanel: 'অ্যাডমিন প্যানেল',
        noData: 'কোনো তথ্য নেই',
        noUpcomingEvents: 'এই মুহূর্তে কোনো আসন্ন ইভেন্ট নেই। পরে আবার দেখুন!',
        viewFullGallery: 'সম্পূর্ণ গ্যালারি দেখুন',
        exploreLatestAlbum: 'সর্বশেষ অ্যালবাম দেখুন',
        noAlbums: 'এখনও কোনো অ্যালবাম নেই',
        uploadFirstGallery: 'আপনার প্রথম গ্যালারি আপলোড করে স্মৃতি শেয়ার করুন।',
        albums: 'অ্যালবাম',
        photos: 'ছবি',
        latest: 'সর্বশেষ',
        eventsOrganized: 'আয়োজিত ইভেন্ট',
        activeMembers: 'সক্রিয় সদস্য',
        socialInitiatives: 'সামাজিক উদ্যোগ',
        tournaments: 'টুর্নামেন্ট',
        followUs: 'ফলো করুন',
        stayConnected: 'সোশ্যাল মিডিয়ায় যুক্ত থাকুন',
        findUs: 'আমাদের খুঁজুন'
      },
      login: {
        title: 'অ্যাডমিন লগইন',
        subtitle: 'Bondhu Gosthi ম্যানেজমেন্ট পোর্টাল',
        emailLabel: 'ইমেইল ঠিকানা',
        passwordLabel: 'পাসওয়ার্ড',
        emailPlaceholder: 'ইমেইল লিখুন',
        passwordPlaceholder: 'পাসওয়ার্ড লিখুন',
        loginButton: 'লগইন',
        success: 'লগইন সফল! আবার স্বাগতম।',
        invalid: 'ভুল তথ্য। আবার চেষ্টা করুন।',
        error: 'একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।',
        togglePassword: 'পাসওয়ার্ড দেখান/লুকান',
        loggingIn: 'লগইন হচ্ছে...',
        secureNote: 'এটি একটি সুরক্ষিত অ্যাডমিন পোর্টাল। শুধুমাত্র অনুমোদিত ব্যক্তিরা প্রবেশ করতে পারবেন।'
      },
      notFound: {
        title: 'পৃষ্ঠা পাওয়া যায়নি',
        subtitle: 'আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই।',
        backHome: 'হোমে ফিরে যান'
      },
      admin: {
        dashboard: 'ড্যাশবোর্ড',
        events: 'ইভেন্ট',
        sports: 'খেলা',
        socialWork: 'সামাজিক কাজ',
        gallery: 'গ্যালারি',
        sliderImages: 'স্লাইডার ছবি',
        members: 'সদস্য',
        news: 'সংবাদ',
        contact: 'যোগাযোগ',
        pages: 'পেজ',
        homeEdit: 'হোম এডিট',
        aboutEdit: 'অ্যাবাউট এডিট',
        contactEdit: 'কন্ট্যাক্ট এডিট',
        footerEdit: 'ফুটার এডিট',
        settings: 'সেটিংস',
        seo: 'SEO',
        usersRoles: 'ইউজার ও রোল',
        backups: 'ব্যাকআপ',
        security: 'সিকিউরিটি',
        activityLogs: 'অ্যাক্টিভিটি লগ',
        viewWebsite: 'ওয়েবসাইট দেখুন',
        logout: 'লগআউট',
        adminPanel: 'অ্যাডমিন প্যানেল'
      }
    }
  }
  ,
  pt: {
    translation: {
      nav: {
        home: 'Início',
        about: 'Sobre',
        events: 'Eventos',
        sports: 'Esportes',
        socialWork: 'Ação social',
        gallery: 'Galeria',
        members: 'Membros',
        news: 'Notícias',
        contact: 'Contato',
        themeLight: 'Mudar para modo claro',
        themeDark: 'Mudar para modo escuro',
        language: 'Idioma'
      },
      footer: {
        taglineFallback: 'Uma família de amigos',
        description: 'Bondhu Gosthi é mais do que um clube: é uma família que une pessoas por meio de esporte, cultura e serviço comunitário. Junte-se a nós!',
        quickLinks: 'Links rápidos',
        importantLinks: 'Links importantes',
        getInTouch: 'Entre em contato',
        adminLogin: 'Login do administrador',
        copyright: 'Copyright {{year}} Bondhu Gosthi.',
        madeWith: 'Feito com',
        byTeam: 'por nossa equipe'
      },
      common: {
        loading: 'Carregando...',
        loadingHome: 'Carregando a página inicial...',
        learnMore: 'Saiba mais',
        viewAllEvents: 'Ver todos os eventos',
        viewAllNews: 'Ver todas as notícias',
        readMore: 'Leia mais',
        getInTouch: 'Entre em contato',
        sendMessage: 'Enviar mensagem',
        sending: 'Enviando...',
        submit: 'Enviar',
        search: 'Pesquisar',
        viewWebsite: 'Ver site',
        logout: 'Sair',
        adminPanel: 'Painel administrativo',
        noData: 'Nenhum dado disponível',
        noUpcomingEvents: 'Nenhum evento próximo no momento. Volte em breve!',
        viewFullGallery: 'Ver galeria completa',
        exploreLatestAlbum: 'Explorar último álbum',
        noAlbums: 'Nenhum álbum ainda',
        uploadFirstGallery: 'Envie sua primeira galeria para compartilhar memórias.',
        albums: 'Álbuns',
        photos: 'Fotos',
        latest: 'Último',
        eventsOrganized: 'Eventos organizados',
        activeMembers: 'Membros ativos',
        socialInitiatives: 'Iniciativas sociais',
        tournaments: 'Torneios',
        followUs: 'Siga-nos',
        stayConnected: 'Fique conectado nas redes sociais',
        findUs: 'Encontre-nos'
      },
      login: {
        title: 'Login do administrador',
        subtitle: 'Portal de gestão Bondhu Gosthi',
        emailLabel: 'E-mail',
        passwordLabel: 'Senha',
        emailPlaceholder: 'Digite seu e-mail',
        passwordPlaceholder: 'Digite sua senha',
        loginButton: 'Entrar',
        success: 'Login realizado com sucesso! Bem-vindo.',
        invalid: 'Credenciais inválidas. Tente novamente.',
        error: 'Ocorreu um erro. Tente novamente.',
        togglePassword: 'Mostrar/ocultar senha',
        loggingIn: 'Entrando...',
        secureNote: 'Este é um portal admin seguro. Apenas pessoal autorizado pode acessar.'
      },
      notFound: {
        title: 'Página não encontrada',
        subtitle: 'A página que você procura não existe.',
        backHome: 'Voltar para início'
      },
      admin: {
        dashboard: 'Painel',
        events: 'Eventos',
        sports: 'Esportes',
        socialWork: 'Ação social',
        gallery: 'Galeria',
        sliderImages: 'Imagens do slider',
        members: 'Membros',
        news: 'Notícias',
        contact: 'Contato',
        pages: 'Páginas',
        homeEdit: 'Editar início',
        aboutEdit: 'Editar sobre',
        contactEdit: 'Editar contato',
        footerEdit: 'Editar rodapé',
        settings: 'Configurações',
        seo: 'SEO',
        usersRoles: 'Usuários e funções',
        backups: 'Backups',
        security: 'Segurança',
        activityLogs: 'Logs de atividade',
        viewWebsite: 'Ver site',
        logout: 'Sair',
        adminPanel: 'Painel administrativo'
      }
    }
  },
  ru: {
    translation: {
      nav: {
        home: 'Главная',
        about: 'О нас',
        events: 'События',
        sports: 'Спорт',
        socialWork: 'Соцработа',
        gallery: 'Галерея',
        members: 'Участники',
        news: 'Новости',
        contact: 'Контакты',
        themeLight: 'Переключить на светлую тему',
        themeDark: 'Переключить на темную тему',
        language: 'Язык'
      },
      footer: {
        taglineFallback: 'Семья друзей',
        description: 'Bondhu Gosthi — это больше, чем клуб: это семья, объединяющая людей через спорт, культуру и служение обществу. Присоединяйтесь!',
        quickLinks: 'Быстрые ссылки',
        importantLinks: 'Важные ссылки',
        getInTouch: 'Свяжитесь с нами',
        adminLogin: 'Вход для администратора',
        copyright: 'Copyright {{year}} Bondhu Gosthi.',
        madeWith: 'Сделано с любовью',
        byTeam: 'нашей командой'
      },
      common: {
        loading: 'Загрузка...',
        loadingHome: 'Загрузка главной страницы...',
        learnMore: 'Подробнее',
        viewAllEvents: 'Все события',
        viewAllNews: 'Все новости',
        readMore: 'Читать далее',
        getInTouch: 'Связаться',
        sendMessage: 'Отправить сообщение',
        sending: 'Отправка...',
        submit: 'Отправить',
        search: 'Поиск',
        viewWebsite: 'Открыть сайт',
        logout: 'Выйти',
        adminPanel: 'Панель администратора',
        noData: 'Нет данных',
        noUpcomingEvents: 'Пока нет ближайших событий. Загляните позже!',
        viewFullGallery: 'Открыть галерею',
        exploreLatestAlbum: 'Последний альбом',
        noAlbums: 'Альбомов пока нет',
        uploadFirstGallery: 'Загрузите первую галерею, чтобы поделиться воспоминаниями.',
        albums: 'Альбомы',
        photos: 'Фото',
        latest: 'Последнее',
        eventsOrganized: 'События',
        activeMembers: 'Активные участники',
        socialInitiatives: 'Социальные инициативы',
        tournaments: 'Турниры',
        followUs: 'Подписывайтесь',
        stayConnected: 'Оставайтесь на связи в соцсетях',
        findUs: 'Как нас найти'
      },
      login: {
        title: 'Вход для администратора',
        subtitle: 'Портал управления Bondhu Gosthi',
        emailLabel: 'Email',
        passwordLabel: 'Пароль',
        emailPlaceholder: 'Введите email',
        passwordPlaceholder: 'Введите пароль',
        loginButton: 'Войти',
        success: 'Успешный вход! С возвращением.',
        invalid: 'Неверные данные. Попробуйте снова.',
        error: 'Произошла ошибка. Попробуйте снова.',
        togglePassword: 'Показать/скрыть пароль',
        loggingIn: 'Вход...',
        secureNote: 'Это защищенный админ-портал. Доступ только для авторизованных.'
      },
      notFound: {
        title: 'Страница не найдена',
        subtitle: 'Запрашиваемая страница не существует.',
        backHome: 'На главную'
      },
      admin: {
        dashboard: 'Панель',
        events: 'События',
        sports: 'Спорт',
        socialWork: 'Соцработа',
        gallery: 'Галерея',
        sliderImages: 'Слайдер',
        members: 'Участники',
        news: 'Новости',
        contact: 'Контакты',
        pages: 'Страницы',
        homeEdit: 'Редактировать главную',
        aboutEdit: 'Редактировать о нас',
        contactEdit: 'Редактировать контакты',
        footerEdit: 'Редактировать футер',
        settings: 'Настройки',
        seo: 'SEO',
        usersRoles: 'Пользователи и роли',
        backups: 'Резервные копии',
        security: 'Безопасность',
        activityLogs: 'Журнал активности',
        viewWebsite: 'Открыть сайт',
        logout: 'Выйти',
        adminPanel: 'Панель администратора'
      }
    }
  },
  ur: {
    translation: {
      nav: {
        home: 'ہوم',
        about: 'ہمارے بارے میں',
        events: 'ایونٹس',
        sports: 'کھیل',
        socialWork: 'سماجی کام',
        gallery: 'گیلری',
        members: 'اراکین',
        news: 'خبریں',
        contact: 'رابطہ',
        themeLight: 'لائٹ موڈ پر جائیں',
        themeDark: 'ڈارک موڈ پر جائیں',
        language: 'زبان'
      },
      footer: {
        taglineFallback: 'دوستوں کا خاندان',
        description: 'Bondhu Gosthi صرف ایک کلب نہیں بلکہ ایک خاندان ہے جو کھیل، ثقافت اور کمیونٹی سروس کے ذریعے لوگوں کو جوڑتا ہے۔ ہمارے ساتھ تبدیلی لائیں!',
        quickLinks: 'فوری لنکس',
        importantLinks: 'اہم لنکس',
        getInTouch: 'رابطہ کریں',
        adminLogin: 'ایڈمن لاگ اِن',
        copyright: 'کاپی رائٹ {{year}} Bondhu Gosthi۔',
        madeWith: 'محبت سے بنایا گیا',
        byTeam: 'ہماری ٹیم کی طرف سے'
      },
      common: {
        loading: 'لوڈ ہو رہا ہے...',
        loadingHome: 'ہوم پیج لوڈ ہو رہا ہے...',
        learnMore: 'مزید جانیں',
        viewAllEvents: 'تمام ایونٹس دیکھیں',
        viewAllNews: 'تمام خبریں دیکھیں',
        readMore: 'مزید پڑھیں',
        getInTouch: 'رابطہ کریں',
        sendMessage: 'پیغام بھیجیں',
        sending: 'بھیجا جا رہا ہے...',
        submit: 'جمع کریں',
        search: 'تلاش',
        viewWebsite: 'ویب سائٹ دیکھیں',
        logout: 'لاگ آؤٹ',
        adminPanel: 'ایڈمن پینل',
        noData: 'کوئی ڈیٹا دستیاب نہیں',
        noUpcomingEvents: 'ابھی کوئی آنے والا ایونٹ نہیں۔ بعد میں دوبارہ دیکھیں!',
        viewFullGallery: 'مکمل گیلری دیکھیں',
        exploreLatestAlbum: 'تازہ ترین البم دیکھیں',
        noAlbums: 'ابھی کوئی البم نہیں',
        uploadFirstGallery: 'اپنی پہلی گیلری اپ لوڈ کریں اور یادیں شیئر کریں۔',
        albums: 'البمز',
        photos: 'تصاویر',
        latest: 'تازہ ترین',
        eventsOrganized: 'منعقدہ ایونٹس',
        activeMembers: 'فعال اراکین',
        socialInitiatives: 'سماجی اقدامات',
        tournaments: 'ٹورنامنٹس',
        followUs: 'ہمیں فالو کریں',
        stayConnected: 'سوشل میڈیا پر جڑے رہیں',
        findUs: 'ہمیں تلاش کریں'
      },
      login: {
        title: 'ایڈمن لاگ اِن',
        subtitle: 'Bondhu Gosthi مینجمنٹ پورٹل',
        emailLabel: 'ای میل',
        passwordLabel: 'پاس ورڈ',
        emailPlaceholder: 'ای میل درج کریں',
        passwordPlaceholder: 'پاس ورڈ درج کریں',
        loginButton: 'لاگ اِن',
        success: 'کامیابی سے لاگ اِن ہو گیا! خوش آمدید۔',
        invalid: 'غلط معلومات۔ دوبارہ کوشش کریں۔',
        error: 'ایک خرابی ہوئی۔ دوبارہ کوشش کریں۔',
        togglePassword: 'پاس ورڈ دکھائیں/چھپائیں',
        loggingIn: 'لاگ اِن ہو رہا ہے...',
        secureNote: 'یہ ایک محفوظ ایڈمن پورٹل ہے۔ صرف مجاز افراد ہی رسائی حاصل کر سکتے ہیں۔'
      },
      notFound: {
        title: 'صفحہ نہیں ملا',
        subtitle: 'آپ جس صفحے کو تلاش کر رہے ہیں وہ موجود نہیں۔',
        backHome: 'ہوم پر جائیں'
      },
      admin: {
        dashboard: 'ڈیش بورڈ',
        events: 'ایونٹس',
        sports: 'کھیل',
        socialWork: 'سماجی کام',
        gallery: 'گیلری',
        sliderImages: 'سلائیڈر تصاویر',
        members: 'اراکین',
        news: 'خبریں',
        contact: 'رابطہ',
        pages: 'صفحات',
        homeEdit: 'ہوم ایڈٹ',
        aboutEdit: 'اباؤٹ ایڈٹ',
        contactEdit: 'کانٹیکٹ ایڈٹ',
        footerEdit: 'فوٹر ایڈٹ',
        settings: 'سیٹنگز',
        seo: 'SEO',
        usersRoles: 'یوزرز و رولز',
        backups: 'بیک اپس',
        security: 'سیکیورٹی',
        activityLogs: 'ایکٹیویٹی لاگز',
        viewWebsite: 'ویب سائٹ دیکھیں',
        logout: 'لاگ آؤٹ',
        adminPanel: 'ایڈمن پینل'
      }
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: storedLanguage || 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  }
});

const applyDirection = (language) => {
  if (typeof document === 'undefined') {
    return;
  }
  const dir = rtlLanguages.has(language) ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', language);
  document.body?.setAttribute('dir', dir);
};

applyDirection(storedLanguage || 'en');

i18n.on('languageChanged', (language) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('appLanguage', language);
  }
  applyDirection(language);
});

export default i18n;
